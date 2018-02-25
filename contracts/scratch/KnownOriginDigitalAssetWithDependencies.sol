pragma solidity 0.4.19;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

/**
 * Interface for required functionality in the ERC721 standard
 * for non-fungible tokens.
 *
 * Author: Nadav Hollander (nadav at dharma.io)
 */
contract ERC721 {
    // Function
    function totalSupply() public view returns (uint256 _totalSupply);
    function balanceOf(address _owner) public view returns (uint256 _balance);
    function ownerOf(uint _tokenId) public view returns (address _owner);
    function approve(address _to, uint _tokenId) public;
    function getApproved(uint _tokenId) public view returns (address _approved);
    function transferFrom(address _from, address _to, uint _tokenId) public;
    function transfer(address _to, uint _tokenId) public;
    function implementsERC721() public view returns (bool _implementsERC721);

    // Events
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
}


contract DetailedERC721 is ERC721 {
    function name() public view returns (string _name);
    function symbol() public view returns (string _symbol);
    function tokenMetadata(uint _tokenId) public view returns (string _infoUrl);
    function tokenOfOwnerByIndex(address _owner, uint _index) public view returns (uint _tokenId);
}

/**
 * @title NonFungibleToken
 *
 * Generic implementation for both required and optional functionality in
 * the ERC721 standard for non-fungible tokens.
 *
 * Heavily inspired by Decentraland's generic implementation:
 * https://github.com/decentraland/land/blob/master/contracts/BasicNFT.sol
 *
 * Standard Author: dete
 * Implementation Author: Nadav Hollander <nadav at dharma.io>
 */
contract NonFungibleToken is DetailedERC721 {
    string public name;
    string public symbol;

    uint public numTokensTotal;

    mapping(uint => address) internal tokenIdToOwner;
    mapping(uint => address) internal tokenIdToApprovedAddress;
    mapping(uint => string) internal tokenIdToMetadata;
    mapping(address => uint[]) internal ownerToTokensOwned;
    mapping(uint => uint) internal tokenIdToOwnerArrayIndex;

    event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _tokenId
    );

    event Approval(
    address indexed _owner,
    address indexed _approved,
    uint256 _tokenId
    );

    modifier onlyExtantToken(uint _tokenId) {
        require(ownerOf(_tokenId) != address(0));
        _;
    }

    function name()
    public
    view
    returns (string _name)
    {
        return name;
    }

    function symbol()
    public
    view
    returns (string _symbol)
    {
        return symbol;
    }

    function totalSupply()
    public
    view
    returns (uint256 _totalSupply)
    {
        return numTokensTotal;
    }

    function balanceOf(address _owner)
    public
    view
    returns (uint _balance)
    {
        return ownerToTokensOwned[_owner].length;
    }

    function ownerOf(uint _tokenId)
    public
    view
    returns (address _owner)
    {
        return _ownerOf(_tokenId);
    }

    function tokenMetadata(uint _tokenId)
    public
    view
    returns (string _infoUrl)
    {
        return tokenIdToMetadata[_tokenId];
    }

    function approve(address _to, uint _tokenId)
    public
    onlyExtantToken(_tokenId)
    {
        require(msg.sender == ownerOf(_tokenId));
        require(msg.sender != _to);

        if (_getApproved(_tokenId) != address(0) ||
        _to != address(0)) {
            _approve(_to, _tokenId);
            Approval(msg.sender, _to, _tokenId);
        }
    }

    function transferFrom(address _from, address _to, uint _tokenId)
    public
    onlyExtantToken(_tokenId)
    {
        require(getApproved(_tokenId) == msg.sender);
        require(ownerOf(_tokenId) == _from);
        require(_to != address(0));

        _clearApprovalAndTransfer(_from, _to, _tokenId);

        Approval(_from, 0, _tokenId);
        Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint _tokenId)
    public
    onlyExtantToken(_tokenId)
    {
        require(ownerOf(_tokenId) == msg.sender);
        require(_to != address(0));

        _clearApprovalAndTransfer(msg.sender, _to, _tokenId);

        Approval(msg.sender, 0, _tokenId);
        Transfer(msg.sender, _to, _tokenId);
    }

    function tokenOfOwnerByIndex(address _owner, uint _index)
    public
    view
    returns (uint _tokenId)
    {
        return _getOwnerTokenByIndex(_owner, _index);
    }

    function getOwnerTokens(address _owner)
    public
    view
    returns (uint[] _tokenIds)
    {
        return _getOwnerTokens(_owner);
    }

    function implementsERC721()
    public
    view
    returns (bool _implementsERC721)
    {
        return true;
    }

    function getApproved(uint _tokenId)
    public
    view
    returns (address _approved)
    {
        return _getApproved(_tokenId);
    }

    function _clearApprovalAndTransfer(address _from, address _to, uint _tokenId)
    internal
    {
        _clearTokenApproval(_tokenId);
        _removeTokenFromOwnersList(_from, _tokenId);
        _setTokenOwner(_tokenId, _to);
        _addTokenToOwnersList(_to, _tokenId);
    }

    function _ownerOf(uint _tokenId)
    internal
    view
    returns (address _owner)
    {
        return tokenIdToOwner[_tokenId];
    }

    function _approve(address _to, uint _tokenId)
    internal
    {
        tokenIdToApprovedAddress[_tokenId] = _to;
    }

    function _getApproved(uint _tokenId)
    internal
    view
    returns (address _approved)
    {
        return tokenIdToApprovedAddress[_tokenId];
    }

    function _getOwnerTokens(address _owner)
    internal
    view
    returns (uint[] _tokens)
    {
        return ownerToTokensOwned[_owner];
    }

    function _getOwnerTokenByIndex(address _owner, uint _index)
    internal
    view
    returns (uint _tokens)
    {
        return ownerToTokensOwned[_owner][_index];
    }

    function _clearTokenApproval(uint _tokenId)
    internal
    {
        tokenIdToApprovedAddress[_tokenId] = address(0);
    }

    function _setTokenOwner(uint _tokenId, address _owner)
    internal
    {
        tokenIdToOwner[_tokenId] = _owner;
    }

    function _addTokenToOwnersList(address _owner, uint _tokenId)
    internal
    {
        ownerToTokensOwned[_owner].push(_tokenId);
        tokenIdToOwnerArrayIndex[_tokenId] =
        ownerToTokensOwned[_owner].length - 1;
    }

    function _removeTokenFromOwnersList(address _owner, uint _tokenId)
    internal
    {
        uint length = ownerToTokensOwned[_owner].length;
        uint index = tokenIdToOwnerArrayIndex[_tokenId];
        uint swapToken = ownerToTokensOwned[_owner][length - 1];

        ownerToTokensOwned[_owner][index] = swapToken;
        tokenIdToOwnerArrayIndex[swapToken] = index;

        delete ownerToTokensOwned[_owner][length - 1];
        ownerToTokensOwned[_owner].length--;
    }

    function _insertTokenMetadata(uint _tokenId, string _metadata)
    internal
    {
        tokenIdToMetadata[_tokenId] = _metadata;
    }
}

contract InternalMintableNonFungibleToken is NonFungibleToken {
    using SafeMath for uint;

    event Mint(address indexed _to, uint256 indexed _tokenId);

    modifier onlyNonexistentToken(uint _tokenId) {
        require(tokenIdToOwner[_tokenId] == address(0));
        _;
    }

    function _mint(address _owner, uint256 _tokenId, string _metadata)
    internal
    onlyNonexistentToken(_tokenId)
    {
        _setTokenOwner(_tokenId, _owner);
        _addTokenToOwnersList(_owner, _tokenId);

        numTokensTotal = numTokensTotal.add(1);

        _insertTokenMetadata(_tokenId, _metadata);
        Mint(_owner, _tokenId);
    }
}

//// INSERT KODA CONTRACT HERE  /////

/**
* @title KnownOriginDigitalAsset
*
* A curator can mint digital assets and sell them via purchases (crypto via Ether or Fiat)
*/
contract KnownOriginDigitalAsset is InternalMintableNonFungibleToken {
  using SafeMath for uint;

  // creates and owns the original assets all primary purchases transferred to this account
  address public curator;

  // the person who is responsible for designing and building the contract
  address public contractDeveloper;

  // the person who puts on the event
  address public commissionAccount;

  uint256 public totalPurchaseValueInWei;
  uint public totalNumberOfPurchases;

  enum PurchaseState { Unsold, EtherPurchase, FiatPurchase }

  mapping(uint => PurchaseState) internal tokenIdToPurchased;
  mapping(uint => string) internal tokenIdToEdition;
  mapping(uint => uint8) internal tokenIdToEditionNumber;
  mapping(uint => uint256) internal tokenIdToPriceInWei;
  mapping(uint => uint256) internal tokenIdToBuyFromDate;

  event PurchasedWithEther(uint256 indexed _tokenId, address indexed _buyer);
  event PurchasedWithFiat(uint256 indexed _tokenId);

  modifier onlyCurator() {
    require(msg.sender == curator);
    _;
  }

  modifier onlyUnsold(uint256 _tokenId) {
    require(tokenIdToPurchased[_tokenId] == PurchaseState.Unsold);
    _;
  }

  modifier onlyCuratorOwnedToken(uint256 _tokenId) {
    require(tokenIdToOwner[_tokenId] == curator);
    _;
  }

  modifier onlyWhenBuyDateOpen(uint256 _tokenId) {
    require(tokenIdToBuyFromDate[_tokenId] <= block.timestamp);
    _;
  }

  function KnownOriginDigitalAsset(address _commissionAccount, address _contractDeveloper)
  public {
    curator = msg.sender;
    contractDeveloper = _contractDeveloper;
    commissionAccount = _commissionAccount;
    name = "KnownOriginDigitalAsset";
    symbol = "KODA";
  }

  function mintEdition(string _metadata, string _edition, uint8 _totalEdition, uint256 _priceInWei, uint _auctionStartDate)
  public
  onlyCurator {

    uint offset = numTokensTotal;
    for (uint8 i = 0; i < _totalEdition; i++) {
      uint _tokenId = offset + i;
      require(tokenIdToOwner[_tokenId] == address(0));
      _mint(msg.sender, _tokenId, _metadata);
      tokenIdToEdition[_tokenId] = _edition;
      tokenIdToEditionNumber[_tokenId] = i + 1;
      tokenIdToPriceInWei[_tokenId] = _priceInWei;
      tokenIdToBuyFromDate[_tokenId] = _auctionStartDate;
    }
  }

  function mint(string _metadata, string _edition, uint256 _priceInWei, uint _auctionStartDate)
  public
  onlyCurator {
    uint _tokenId = numTokensTotal;
    require(tokenIdToOwner[_tokenId] == address(0));
    _mint(msg.sender, _tokenId, _metadata);
    tokenIdToEdition[_tokenId] = _edition;
    tokenIdToEditionNumber[_tokenId] = 1;
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    tokenIdToBuyFromDate[_tokenId] = _auctionStartDate;
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

  function priceOfInWei(uint _tokenId)
  public
  view
  returns (uint256 _priceInWei) {
    return tokenIdToPriceInWei[_tokenId];
  }

  function setPriceInWei(uint _tokenId, uint256 _priceInWei)
  public
  onlyCurator
  onlyUnsold(_tokenId)
  onlyCuratorOwnedToken(_tokenId)
  returns (bool) {
    tokenIdToPriceInWei[_tokenId] = _priceInWei;
    return true;
  }

  function purchaseWithEther(uint _tokenId)
  public
  payable
  onlyUnsold(_tokenId)
  onlyCuratorOwnedToken(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool) {

    if (msg.value >= tokenIdToPriceInWei[_tokenId]) {

      // approve sender as they have paid the required amount
      _approve(msg.sender, _tokenId);
      Approval(curator, msg.sender, _tokenId);

      // transfer assets from contract creator (curator) to new owner
      transferFrom(curator, msg.sender, _tokenId);

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
  onlyCurator
  onlyUnsold(_tokenId)
  onlyCuratorOwnedToken(_tokenId)
  onlyWhenBuyDateOpen(_tokenId)
  returns (bool) {

    // now purchased - don't allow re-purchase!
    tokenIdToPurchased[_tokenId] = PurchaseState.FiatPurchase;

    totalNumberOfPurchases = totalNumberOfPurchases.add(1);

    PurchasedWithFiat(_tokenId);

    return true;
  }

  // Start date not added to avoid "stack to deep" errors - see tokenAuctionOpenDate() for accessor
  function assetInfo(uint _tokenId)
  public
  view
  returns (
  uint256 _tokId,
  address _owner,
  string _metadata,
  string _edition,
  uint8 _editionNo,
  PurchaseState _purchaseState,
  uint256 _priceInWei
  ) {
    return (
    _tokenId,
    tokenIdToOwner[_tokenId],
    tokenIdToMetadata[_tokenId],
    tokenIdToEdition[_tokenId],
    tokenIdToEditionNumber[_tokenId],
    tokenIdToPurchased[_tokenId],
    tokenIdToPriceInWei[_tokenId]
    );
  }
}
