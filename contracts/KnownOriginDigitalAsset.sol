pragma solidity ^0.4.18;


import "./ERC721Token.sol";
import "./Strings.sol";


/**
* @title KnownOriginDigitalAsset
*
* A curator can mint digital assets and sell them via purchases (crypto via Ether or Fiat)
*/
contract KnownOriginDigitalAsset is ERC721Token {
  using SafeMath for uint256;

  struct CommissionStructure {
    uint8 curator;
    uint8 developer;
  }

  // creates and owns the original assets all primary purchases transferred to this account
  address public curatorAccount;

  // the person who is responsible for designing and building the contract
  address public developerAccount;

  // the person who puts on the event
  address public commissionAccount;

  string public tokenBaseURI = "https://ipfs.infura.io/";

  uint256 public totalPurchaseValueInWei;

  uint256 public totalNumberOfPurchases;

  enum PurchaseState {Unsold, EtherPurchase, FiatPurchase}

  mapping(string => CommissionStructure) internal editionTypeToCommission;
  mapping(uint256 => PurchaseState) internal tokenIdToPurchased;

  mapping(uint256 => bytes16) internal tokenIdToEdition;
  mapping(uint256 => uint256) internal tokenIdToPriceInWei;
  mapping(uint256 => uint32) internal tokenIdToPurchaseFromTime;

  mapping(bytes16 => uint256) internal editionToEditionNumber;

  event PurchasedWithEther(uint256 indexed _tokenId, address indexed _buyer);

  event PurchasedWithFiat(uint256 indexed _tokenId);

  event PurchasedWithFiatReversed(uint256 indexed _tokenId);

  modifier onlyCurator() {
    require(msg.sender == curatorAccount);
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
    require(tokenOwner[_tokenId] == curatorAccount || tokenOwner[_tokenId] == developerAccount);
    _;
  }

  modifier onlyManagement() {
    require(msg.sender == curatorAccount || msg.sender == developerAccount);
    _;
  }

  modifier onlyAfterPurchaseFromTime(uint256 _tokenId) {
    require(tokenIdToPurchaseFromTime[_tokenId] <= block.timestamp);
    _;
  }

  function KnownOriginDigitalAsset(address _commissionAccount, address _developerAccount) public ERC721Token("KnownOriginDigitalAsset", "KODA") {
    curatorAccount = msg.sender;
    commissionAccount = _commissionAccount;
    developerAccount = _developerAccount;

    // Setup default commission structures
    editionTypeToCommission["DIG"] = CommissionStructure({curator : 12, developer : 12});
    editionTypeToCommission["PHY"] = CommissionStructure({curator : 24, developer : 15});
  }

  // don't accept payment directly to contract
  function () public payable {
    revert();
  }

  function mint(string _tokenURI, bytes16 _edition, uint256 _priceInWei, uint32 _auctionStartDate) public onlyManagement {
    uint256 _tokenId = allTokens.length;
    super._mint(msg.sender, _tokenId);
    super._setTokenURI(_tokenId, _tokenURI);
    _populateTokenData(_tokenId, _edition, _priceInWei, _auctionStartDate);
  }

  function _populateTokenData(uint _tokenId, bytes16 _edition, uint256 _priceInWei, uint32 _purchaseFromTime) internal {
    tokenIdToEdition[_tokenId] = _edition;
    editionToEditionNumber[_edition] = editionToEditionNumber[_edition].add(1);
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    tokenIdToPurchaseFromTime[_tokenId] = _purchaseFromTime;
  }

  function burn(uint256 _tokenId) public onlyManagement onlyUnsold(_tokenId) onlyManagementOwnedToken(_tokenId) {
    // TODO fix me - clean up internal metadata when being burnt
    // _populateTokenData(_tokenId, 0x0, 0, 0) << will work?
    super._burn(ownerOf(_tokenId), _tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _uri) public onlyManagement {
    _setTokenURI(_tokenId, _uri);
  }

  function setPriceInWei(uint _tokenId, uint256 _priceInWei) public onlyManagement onlyUnsold(_tokenId) returns (bool _result) {
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    return true;
  }

  /**
   * @dev Used to pre-approve a purchaser in order for internal purchase methods
   * to succeed without calling approve() directly
   * @param _tokenId uint256 ID of the token to query the approval of
   * @return address currently approved for a the given token ID
   */
  function _approvePurchaser(address _to, uint256 _tokenId) internal {
    address owner = ownerOf(_tokenId);
    require(_to != address(0));

    tokenApprovals[_tokenId] = _to;
    Approval(owner, _to, _tokenId);
  }

  function updateCommission(string _type, uint8 _curator, uint8 _developer) public onlyManagement returns (bool) {
    require(_curator > 0);
    require(_developer > 0);
    require((_curator + _developer) < 100);

    editionTypeToCommission[_type] = CommissionStructure({curator : _curator, developer : _developer});
    return true;
  }

  function getCommissionForType(string _type) public view returns (uint8 _curator, uint8 _developer) {
    CommissionStructure storage commission = editionTypeToCommission[_type];
    return (
    commission.curator,
    commission.developer
    );
  }

  function purchaseWithEther(uint256 _tokenId) public payable onlyUnsold(_tokenId) onlyAfterPurchaseFromTime(_tokenId) returns (bool _result) {

    uint256 priceInWei = tokenIdToPriceInWei[_tokenId];

    if (msg.value >= priceInWei) {

      // approve sender as they have paid the required amount
      _approvePurchaser(msg.sender, _tokenId);

      // transfer assets from contract creator (curator) to new owner
      safeTransferFrom(curatorAccount, msg.sender, _tokenId);

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

  function _applyCommission(uint256 _tokenId) internal {
    bytes16 edition = tokenIdToEdition[_tokenId];

    string memory typeCode = getTypeFromEdition(edition);

    CommissionStructure memory commission = editionTypeToCommission[typeCode];

    // split & transfer fee for curator
    uint curatorAccountFee = msg.value / 100 * commission.curator;
    curatorAccount.transfer(curatorAccountFee);

    // split & transfer fee for developer
    uint developerAccountFee = msg.value / 100 * commission.developer;
    developerAccount.transfer(developerAccountFee);

    // final payment to commission would be the remaining value
    uint finalCommissionTotal = msg.value - (curatorAccountFee + developerAccountFee);

    // send ether
    commissionAccount.transfer(finalCommissionTotal);
  }

  function purchaseWithFiat(uint256 _tokenId) public onlyManagement onlyUnsold(_tokenId) onlyAfterPurchaseFromTime(_tokenId) returns (bool _result) {

    // now purchased - don't allow re-purchase!
    tokenIdToPurchased[_tokenId] = PurchaseState.FiatPurchase;

    totalNumberOfPurchases = totalNumberOfPurchases.add(1);

    PurchasedWithFiat(_tokenId);

    return true;
  }

  function reverseFiatPurchase(uint256 _tokenId) public onlyManagement onlyFiatPurchased(_tokenId) onlyAfterPurchaseFromTime(_tokenId) returns (bool _result) {

    // reset to Unsold
    tokenIdToPurchased[_tokenId] = PurchaseState.Unsold;

    totalNumberOfPurchases = totalNumberOfPurchases.sub(1);

    PurchasedWithFiatReversed(_tokenId);

    return true;
  }

  function assetInfo(uint _tokenId) public view returns (
    uint256 _tokId,
    address _owner,
    PurchaseState _purchaseState,
    uint256 _priceInWei,
    uint32 _purchaseFromTime
  ) {
    return (
    _tokenId,
    ownerOf(_tokenId),
    tokenIdToPurchased[_tokenId],
    tokenIdToPriceInWei[_tokenId],
    tokenIdToPurchaseFromTime[_tokenId]
    );
  }

  function editionInfo(uint256 _tokenId) public view returns (
    uint256 _tokId,
    bytes16 _edition,
    uint256 _editionNumber,
    string _tokenURI
  ) {

    bytes16 edition = tokenIdToEdition[_tokenId];
    return (
    _tokenId,
    edition,
    editionToEditionNumber[edition],
    tokenURI(_tokenId)
    );
  }

  function tokensOf(address _owner) public view returns (uint256[] _tokenIds) {
    return ownedTokens[_owner];
  }

  function isPurchased(uint256 _tokenId) public view returns (PurchaseState _purchased) {
    return tokenIdToPurchased[_tokenId];
  }

  function editionOf(uint256 _tokenId) public view returns (bytes16 _edition) {
    return tokenIdToEdition[_tokenId];
  }

  function purchaseFromTime(uint256 _tokenId) public view returns (uint32 _purchaseFromTime) {
    return tokenIdToPurchaseFromTime[_tokenId];
  }

  function priceInWei(uint256 _tokenId) public view returns (uint256 _priceInWei) {
    return tokenIdToPriceInWei[_tokenId];
  }

  function getTypeFromEdition(bytes16 _bytes16) public pure returns (string) {
    // return last 3 chars that represent the edition type
    return Strings.bytes16ToStr(_bytes16, 13, 16);
  }

  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));
    return Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId]);
  }

  function setTokenBaseURI(string _newBaseURI) external onlyManagement {
    tokenBaseURI = _newBaseURI;
  }
}
