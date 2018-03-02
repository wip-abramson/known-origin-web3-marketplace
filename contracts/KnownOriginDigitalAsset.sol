pragma solidity ^0.4.18;
import "./InternalMintableNonFungibleToken.sol";

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
