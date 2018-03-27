pragma solidity ^0.4.18;


import "./ERC721Token.sol";


/**
* @title KnownOriginDigitalAsset
*
* A curator can mint digital assets and sell them via purchases (crypto via Ether or Fiat)
*/
contract KnownOriginDigitalAsset is ERC721Token {
  using SafeMath for uint;

  // creates and owns the original assets all primary purchases transferred to this account
  address public curator;

  // the person who is responsible for designing and building the contract
  address public contractDeveloper;

  // the person who puts on the event
  address public commissionAccount;

  uint256 public totalPurchaseValueInWei;

  uint public totalNumberOfPurchases;

  enum PurchaseState {Unsold, EtherPurchase, FiatPurchase}

  mapping (uint => PurchaseState) internal tokenIdToPurchased;

  mapping (uint => string) internal tokenIdToEdition;

  mapping (uint => uint8) internal tokenIdToEditionNumber;

  mapping (uint => string) internal tokenIdToEditionName;

  mapping (uint => string) internal tokenIdToArtist;

  mapping (uint => string) internal tokenIdToType;

  mapping (uint => uint256) internal tokenIdToPriceInWei;

  mapping (uint => uint256) internal tokenIdToBuyFromDate;

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
    require(tokenIdToBuyFromDate[_tokenId] <= block.timestamp);
    _;
  }

  function KnownOriginDigitalAsset(address _commissionAccount, address _contractDeveloper)
  public
  ERC721Token("KnownOriginDigitalAsset", "KODA")
  {
    curator = msg.sender;
    commissionAccount = _commissionAccount;
    contractDeveloper = _contractDeveloper;
  }

  function mintEdition(string _tokenURI, string _edition, string _artist, string _editionName, string _type, uint8 _totalEdition, uint256 _priceInWei, uint _auctionStartDate)
  public
  onlyManagement {

    uint256 offset = allTokens.length;
    for (uint8 i = 0; i < _totalEdition; i++) {
      uint256 _tokenId = offset + i;
      super._mint(msg.sender, _tokenId);
      super._setTokenURI(_tokenId, _tokenURI);
      _populateTokenData(_tokenId, _edition, _editionName, i + 1, _artist, _type, _priceInWei, _auctionStartDate);
    }
  }

  function mint(string _tokenURI, string _edition, string _artist, string _editionName, string _type, uint256 _priceInWei, uint _auctionStartDate)
  public
  onlyManagement {

    uint256 _tokenId = allTokens.length;
    super._mint(msg.sender, _tokenId);
    super._setTokenURI(_tokenId, _tokenURI);
    _populateTokenData(_tokenId, _edition, _editionName, 1, _artist, _type, _priceInWei, _auctionStartDate);
  }

  function _populateTokenData(uint _tokenId, string _edition, string _editionName, uint8 _editionNumber, string _artist, string _type, uint256 _priceInWei, uint _auctionStartDate)
  internal
  {
    tokenIdToEdition[_tokenId] = _edition;
    tokenIdToEditionNumber[_tokenId] = _editionNumber;
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    tokenIdToBuyFromDate[_tokenId] = _auctionStartDate;
    tokenIdToType[_tokenId] = _type;
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
  returns (string _edition) {
    return tokenIdToEdition[_tokenId];
  }

  function auctionOpened(uint _tokenId)
  public
  view
  returns (bool) {
    return tokenIdToBuyFromDate[_tokenId] <= block.timestamp;
  }

  function tokenAuctionOpenDate(uint _tokenId)
  public
  view
  returns (uint _auctionStartDate) {
    return tokenIdToBuyFromDate[_tokenId];
  }

  // Utility function to get current block.timestamp = now() - good for testing with remix/truffle
  function getNow() public constant returns (uint) {
    return now;
  }

  function priceInWei(uint _tokenId)
  public
  view
  returns (uint256 _priceInWei) {
    return tokenIdToPriceInWei[_tokenId];
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
   * @dev Used to force set an approval in order for internal purchase methods to succeed
   * @param _tokenId uint256 ID of the token to query the approval of
   * @return address currently approved for a the given token ID
   */
  function _forceApproval(address _to, uint _tokenId)
  internal
  {
    address owner = ownerOf(_tokenId);
    require(_to != address(0));

    tokenApprovals[_tokenId] = _to;
    Approval(owner, _to, _tokenId);
  }

  function purchaseWithEther(uint256 _tokenId)
  public
  payable
  onlyUnsold(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool _success) {

    if (msg.value >= tokenIdToPriceInWei[_tokenId]) {

      // approve sender as they have paid the required amount
      _forceApproval(msg.sender, _tokenId);

      // transfer assets from contract creator (curator) to new owner
      safeTransferFrom(curator, msg.sender, _tokenId);

      // now purchased - don't allow re-purchase!
      tokenIdToPurchased[_tokenId] = PurchaseState.EtherPurchase;

      totalPurchaseValueInWei = totalPurchaseValueInWei.add(msg.value);
      totalNumberOfPurchases = totalNumberOfPurchases.add(1);

      // TODO provide config for fee split

      // split & transfer 15% fee for curator
      uint commissionAccountFee = msg.value / 100 * 15;
      commissionAccount.transfer(commissionAccountFee);

      // split out 15% fee for creator of the contract
      uint contractDeveloperFee = msg.value / 100 * 15;
      contractDeveloper.transfer(contractDeveloperFee);

      // final payment to curator would be 70% of initial price
      uint curatorTotal = msg.value - (commissionAccountFee + contractDeveloperFee);

      // send ether to owner instantly
      curator.transfer(curatorTotal);

      PurchasedWithEther(_tokenId, msg.sender);

      return true;
    }

    return false;
  }

  function purchaseWithFiat(uint _tokenId)
  public
  onlyManagement
  onlyUnsold(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool _success) {

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
  returns (bool _success) {

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
  uint _auctionStartDate
  ) {
    return (
    _tokenId,
    ownerOf(_tokenId),
    tokenIdToPurchased[_tokenId],
    tokenIdToPriceInWei[_tokenId],
    tokenIdToBuyFromDate[_tokenId]
    );
  }

  function editionInfo(uint _tokenId)
  public
  view
  returns (
  uint256 _tokId,
  string _type,
  string _edition,
  string _editionName,
  uint8 _editionNumber,
  string _artist,
  string _tokenURI
  ) {
    return (
    _tokenId,
    tokenIdToType[_tokenId],
    tokenIdToEdition[_tokenId],
    tokenIdToEditionName[_tokenId],
    tokenIdToEditionNumber[_tokenId],
    tokenIdToArtist[_tokenId],
    tokenURI(_tokenId)
    );
  }

}
