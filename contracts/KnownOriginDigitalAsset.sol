pragma solidity ^0.4.18;


import "./ERC721Token.sol";


/**
* @title KnownOriginDigitalAsset
*
* A curator can mint digital assets and sell them via purchases (crypto via Ether or Fiat)
*/
contract KnownOriginDigitalAsset is ERC721Token {
  using SafeMath for uint;

  struct CommissionStructure {
    uint8 curator;
    uint8 developer;
  }

  // creates and owns the original assets all primary purchases transferred to this account
  address public curator;

  // the person who is responsible for designing and building the contract
  address public contractDeveloper;

  // the person who puts on the event
  address public commissionAccount;

  uint256 public totalPurchaseValueInWei;

  uint public totalNumberOfPurchases;

  enum PurchaseState {Unsold, EtherPurchase, FiatPurchase}

  mapping (string => CommissionStructure) internal tokenIdToCommission;
  mapping (uint => PurchaseState) internal tokenIdToPurchased;

  mapping (uint => bytes16) internal tokenIdToEdition;
  mapping (uint => uint8) internal tokenIdToEditionNumber;
  mapping (uint => string) internal tokenIdToEditionName;
  mapping (uint => string) internal tokenIdToArtist;
  mapping (uint => uint256) internal tokenIdToPriceInWei;
  mapping (uint => uint32) internal tokenIdToAuctionStartDate;

  event PurchasedWithEther(uint256 indexed _tokenId, address indexed _buyer);

  event PurchasedWithFiat(uint256 indexed _tokenId);

  event PurchasedWithFiatReversed(uint256 indexed _tokenId);

  modifier onlyCurator() {
    require(msg.sender == curator);
    _;
  }

  modifier onlyUnsold(uint256 _tokenId) {
    require(tokenIdToPurchased[_tokenId] == PurchaseState.Unsold);
    _;
  }

  modifier onlyFiatPurchased(uint256 _tokenId) {
    require(tokenIdToPurchased[_tokenId] == PurchaseState.FiatPurchase);
    _;
  }

  modifier onlyManagementOwnedToken(uint256 _tokenId) {
    require(tokenOwner[_tokenId] == curator || tokenOwner[_tokenId] == contractDeveloper);
    _;
  }

  modifier onlyManagement() {
    require(msg.sender == curator || msg.sender == contractDeveloper);
    _;
  }

  modifier onlyWhenBuyDateOpen(uint256 _tokenId) {
    require(tokenIdToAuctionStartDate[_tokenId] <= block.timestamp);
    _;
  }

  function KnownOriginDigitalAsset(address _commissionAccount, address _contractDeveloper)
  public
  ERC721Token("KnownOriginDigitalAsset", "KODA")
  {
    curator = msg.sender;
    commissionAccount = _commissionAccount;
    contractDeveloper = _contractDeveloper;

    // Setup default commission structures
    tokenIdToCommission["DIG"] = CommissionStructure({curator : 12, developer : 12});
    tokenIdToCommission["PHY"] = CommissionStructure({curator : 24, developer : 15});
  }

  function mintEdition(string _tokenURI, bytes16 _edition, string _artist, string _editionName, uint8 _totalEdition, uint256 _priceInWei, uint32 _auctionStartDate)
  public
  onlyManagement {

    uint256 offset = allTokens.length;
    for (uint8 i = 0; i < _totalEdition; i++) {
      uint256 _tokenId = offset + i;
      super._mint(msg.sender, _tokenId);
      super._setTokenURI(_tokenId, _tokenURI);
      _populateTokenData(_tokenId, _edition, _editionName, i + 1, _artist, _priceInWei, _auctionStartDate);
    }
  }

  function mint(string _tokenURI, bytes16 _edition, string _artist, string _editionName, uint256 _priceInWei, uint32 _auctionStartDate)
  public
  onlyManagement {

    uint256 _tokenId = allTokens.length;
    super._mint(msg.sender, _tokenId);
    super._setTokenURI(_tokenId, _tokenURI);
    _populateTokenData(_tokenId, _edition, _editionName, 1, _artist, _priceInWei, _auctionStartDate);
  }

  function _populateTokenData(uint _tokenId, bytes16 _edition, string _editionName, uint8 _editionNumber, string _artist, uint256 _priceInWei, uint32 _auctionStartDate)
  internal
  {
    tokenIdToEdition[_tokenId] = _edition;
    tokenIdToEditionNumber[_tokenId] = _editionNumber;
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    tokenIdToAuctionStartDate[_tokenId] = _auctionStartDate;
    tokenIdToArtist[_tokenId] = _artist;
    tokenIdToEditionName[_tokenId] = _editionName;
  }

  function burn(uint256 _tokenId)
  public
  onlyManagement
  onlyUnsold(_tokenId)
  onlyManagementOwnedToken(_tokenId)
  {
    // TODO fix me - clean up internal metadata when being burnt
    super._burn(ownerOf(_tokenId), _tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _uri)
  public
  onlyManagement
  {
    _setTokenURI(_tokenId, _uri);
  }

  function setPriceInWei(uint _tokenId, uint256 _priceInWei)
  public
  onlyManagement
  onlyUnsold(_tokenId)
  returns (bool) {
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    return true;
  }

  /**
   * @dev Used to pre-approve a purchaser in order for internal purchase methods
   * to succeed without calling approve() directly
   * @param _tokenId uint256 ID of the token to query the approval of
   * @return address currently approved for a the given token ID
   */
  function _approvePurchaser(address _to, uint _tokenId)
  internal
  {
    address owner = ownerOf(_tokenId);
    require(_to != address(0));

    tokenApprovals[_tokenId] = _to;
    Approval(owner, _to, _tokenId);
  }

  function updateCommission(string _type, uint8 _curator, uint8 _developer)
  public
  onlyManagement
  returns (bool) {
    require(_curator > 0);
    require(_developer > 0);
    require((_curator + _developer) < 100);

    tokenIdToCommission[_type] = CommissionStructure({curator : _curator, developer : _developer});
    return true;
  }

  function getCommissionForType(string _type)
  public
  view
  returns (uint8 _curator, uint8 _developer)
  {
    CommissionStructure storage commission = tokenIdToCommission[_type];
    return (
      commission.curator,
      commission.developer
    );
  }

  function purchaseWithEther(uint256 _tokenId)
  public
  payable
  onlyUnsold(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool) {

    uint256 priceInWei = tokenIdToPriceInWei[_tokenId];

    if (msg.value >= priceInWei) {

      // approve sender as they have paid the required amount
      _approvePurchaser(msg.sender, _tokenId);

      // transfer assets from contract creator (curator) to new owner
      safeTransferFrom(curator, msg.sender, _tokenId);

      // now purchased - don't allow re-purchase!
      tokenIdToPurchased[_tokenId] = PurchaseState.EtherPurchase;

      totalPurchaseValueInWei = totalPurchaseValueInWei.add(msg.value);
      totalNumberOfPurchases = totalNumberOfPurchases.add(1);

      // Only apply commission if the art work has value
      if (priceInWei > 0) {
        _applyCommission(_tokenId);
      }

      PurchasedWithEther(_tokenId, msg.sender);

      return true;
    }
    return false;
  }

  function _applyCommission(uint256 _tokenId)
  internal
  {
    bytes16 edition = tokenIdToEdition[_tokenId];

    string memory typeCode = getTypeFromEdition(edition);

    CommissionStructure memory commission = tokenIdToCommission[typeCode];

    // Handle missing commission, defaults to 2% for both parties
    if (commission.curator == 0) {
      commission.curator = 2;
    }
    if (commission.developer == 0) {
      commission.developer = 2;
    }

    // split & transfer fee for curator
    uint curatorAccountFee = msg.value / 100 * commission.curator;
    curator.transfer(curatorAccountFee);

    // split & transfer fee for developer
    uint contractDeveloperFee = msg.value / 100 * commission.developer;
    contractDeveloper.transfer(contractDeveloperFee);

    // final payment to commission would be the remaining value
    uint finalCommissionTotal = msg.value - (curatorAccountFee + contractDeveloperFee);

    // send ether
    commissionAccount.transfer(finalCommissionTotal);
  }

  function purchaseWithFiat(uint _tokenId)
  public
  onlyManagement
  onlyUnsold(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool) {

    // now purchased - don't allow re-purchase!
    tokenIdToPurchased[_tokenId] = PurchaseState.FiatPurchase;

    totalNumberOfPurchases = totalNumberOfPurchases.add(1);

    PurchasedWithFiat(_tokenId);

    return true;
  }

  function reverseFiatPurchase(uint _tokenId)
  public
  onlyManagement
  onlyFiatPurchased(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool) {

    // reset to Unsold
    tokenIdToPurchased[_tokenId] = PurchaseState.Unsold;

    totalNumberOfPurchases = totalNumberOfPurchases.sub(1);

    PurchasedWithFiatReversed(_tokenId);

    return true;
  }

  function assetInfo(uint _tokenId)
  public
  view
  returns (
  uint256 _tokId,
  address _owner,
  PurchaseState _purchaseState,
  uint256 _priceInWei,
  uint32 _auctionStartDate
  ) {
    return (
    _tokenId,
    ownerOf(_tokenId),
    tokenIdToPurchased[_tokenId],
    tokenIdToPriceInWei[_tokenId],
    tokenIdToAuctionStartDate[_tokenId]
    );
  }

  function editionInfo(uint _tokenId)
  public
  view
  returns (
  uint256 _tokId,
  bytes16 _edition,
  string _editionName,
  uint8 _editionNumber,
  string _artist,
  string _tokenURI
  ) {
    return (
    _tokenId,
    tokenIdToEdition[_tokenId],
    tokenIdToEditionName[_tokenId],
    tokenIdToEditionNumber[_tokenId],
    tokenIdToArtist[_tokenId],
    tokenURI(_tokenId)
    );
  }

  function getOwnerTokens(address _owner)
  public
  view
  returns (uint[] _tokenIds)
  {
    return ownedTokens[_owner];
  }

  function isPurchased(uint256 _tokenId)
  public
  view
  returns (PurchaseState _purchased) {
    return tokenIdToPurchased[_tokenId];
  }

  function editionOf(uint _tokenId)
  public
  view
  returns (bytes16 _edition) {
    return tokenIdToEdition[_tokenId];
  }

  function auctionOpened(uint _tokenId)
  public
  view
  returns (bool) {
    return tokenIdToAuctionStartDate[_tokenId] <= block.timestamp;
  }

  function tokenAuctionOpenDate(uint _tokenId)
  public
  view
  returns (uint32 _auctionStartDate) {
    return tokenIdToAuctionStartDate[_tokenId];
  }

  function priceInWei(uint _tokenId)
  public
  view
  returns (uint256 _priceInWei) {
    return tokenIdToPriceInWei[_tokenId];
  }

  // Utility function to get current block.timestamp = now() - good for testing with remix/truffle
  function getNow() public constant returns (uint) {
    return now;
  }

  function getTypeFromEdition(bytes16 _bytes16) public pure returns (string){
    bytes memory bytesArray = new bytes(3);
    uint pos = 0;
    for (uint256 i = 13; i < 16; i++) {
      bytesArray[pos] = _bytes16[i];
      pos++;
    }
    return string(bytesArray);
  }
}
