const assertRevert = require('../helpers/assertRevert');
// const decodeLogs = require('../helpers/decodeLogs');
const sendTransaction = require('../helpers/sendTransaction').sendTransaction;
const etherToWei = require('../helpers/etherToWei');
const _ = require('lodash');

const BigNumber = web3.BigNumber;

const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');
const ERC721Receiver = artifacts.require('ERC721ReceiverMock');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('KnownOriginDigitalAsset', function (accounts) {
  const curator = accounts[0];
  const _commissionAccount = accounts[1];
  const _contractDeveloper = accounts[2];
  const buyer = accounts[3];
  const anotherBuyer = accounts[4];

  //Purchase states
  const Unsold = 0;
  const EtherPurchase = 1;
  const FiatPurchase = 2;

  const firstTokenId = 1;
  const secondTokenId = 2;

  const unknownTokenId = 99;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const RECEIVER_MAGIC_VALUE = '0xf0b9e5ba';

  const _tokenURI = 'http://ipfs/123/abd';
  const _edition1 = 'ABC';
  const _edition2 = 'DEF'; // TODO prevent duplicate editions in smart contract
  const _artist = 'artist';
  const _editionName = 'JIMBOB';

  const _typeDigital = 'DIG';
  const _typePhysical = 'PYS'; // TODO restrict type down to 3 bytes in smart contract
  const _priceInWei = etherToWei(0.5);
  const _auctionStartDate = 0; // TODO handle this in tests

  // TODO handle mint() methods
  // TODO handle purchase() methods
  // TODO handle custom getters
  // TODO handle custom setters

  beforeEach(async function () {
    this.token = await KnownOriginDigitalAsset.new(_commissionAccount, _contractDeveloper, {from: curator});
  });

  describe('like a ERC721BasicToken', function () {
    beforeEach(async function () {
      await this.token.mint(_tokenURI, _edition1, _artist, _editionName, _typeDigital, _priceInWei, _auctionStartDate, {from: curator});
      await this.token.mint(_tokenURI, _edition2, _artist, _editionName, _typePhysical, _priceInWei, _auctionStartDate, {from: curator});
    });

    describe('balanceOf', function () {
      describe('when the given address owns some tokens', function () {
        it('returns the amount of tokens owned by the given address', async function () {
          const balance = await this.token.balanceOf(curator);
          balance.should.be.bignumber.equal(2);
        });
      });

      describe('when the given address does not own any tokens', function () {
        it('returns 0', async function () {
          const balance = await this.token.balanceOf(buyer);
          balance.should.be.bignumber.equal(0);
        });
      });

      describe('when querying the zero address', function () {
        it('throws', async function () {
          await assertRevert(this.token.balanceOf(0));
        });
      });
    });

    describe('exists', function () {
      describe('when the token exists', function () {
        const tokenId = firstTokenId;

        it('should return true', async function () {
          const result = await this.token.exists(tokenId);
          result.should.be.true;
        });
      });

      describe('when the token does not exist', function () {
        const tokenId = unknownTokenId;

        it('should return false', async function () {
          const result = await this.token.exists(tokenId);
          result.should.be.false;
        });
      });
    });

    describe('ownerOf', function () {
      describe('when the given token ID was tracked by this token', function () {
        const tokenId = firstTokenId;

        it('returns the owner of the given token ID', async function () {
          const owner = await this.token.ownerOf(tokenId);
          owner.should.be.equal(curator);
        });
      });

      describe('when the given token ID was not tracked by this token', function () {
        const tokenId = unknownTokenId;

        it('reverts', async function () {
          await assertRevert(this.token.ownerOf(tokenId));
        });
      });
    });

    describe('transfers', function () {
      const owner = accounts[0];
      const approved = accounts[2];
      const operator = accounts[3];
      const unauthorized = accounts[4];
      const tokenId = firstTokenId;
      const data = '0x42';

      let logs = null;

      beforeEach(async function () {
        this.to = accounts[1];
        await this.token.approve(approved, tokenId, {from: owner});
        await this.token.setApprovalForAll(operator, true, {from: owner});
      });

      const transferWasSuccessful = function ({owner, tokenId, approved}) {
        it('transfers the ownership of the given token ID to the given address', async function () {
          const newOwner = await this.token.ownerOf(tokenId);
          newOwner.should.be.equal(this.to);
        });

        it('clears the approval for the token ID', async function () {
          const approvedAccount = await this.token.getApproved(tokenId);
          approvedAccount.should.be.equal(ZERO_ADDRESS);
        });

        if (approved) {
          it('emits an approval and transfer events', async function () {
            logs.length.should.be.equal(2);
            logs[0].event.should.be.eq('Approval');
            logs[0].args._owner.should.be.equal(owner);
            logs[0].args._approved.should.be.equal(ZERO_ADDRESS);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);

            logs[1].event.should.be.eq('Transfer');
            logs[1].args._from.should.be.equal(owner);
            logs[1].args._to.should.be.equal(this.to);
            logs[1].args._tokenId.should.be.bignumber.equal(tokenId);
          });
        } else {
          it('emits only a transfer event', async function () {
            logs.length.should.be.equal(1);
            logs[0].event.should.be.eq('Transfer');
            logs[0].args._from.should.be.equal(owner);
            logs[0].args._to.should.be.equal(this.to);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
          });
        }

        it('adjusts owners balances', async function () {
          const newOwnerBalance = await this.token.balanceOf(this.to);
          newOwnerBalance.should.be.bignumber.equal(1);

          const previousOwnerBalance = await this.token.balanceOf(owner);
          previousOwnerBalance.should.be.bignumber.equal(1);
        });

        it('adjusts owners tokens by index', async function () {
          if (!this.token.tokenOfOwnerByIndex) return;

          const newOwnerToken = await this.token.tokenOfOwnerByIndex(this.to, 0);
          newOwnerToken.toNumber().should.be.equal(tokenId);

          const previousOwnerToken = await this.token.tokenOfOwnerByIndex(owner, 0);
          previousOwnerToken.toNumber().should.not.be.equal(tokenId);
        });
      };

      const shouldTransferTokensByUsers = function (transferFunction) {
        describe('when called by the owner', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, this.to, tokenId, {from: owner}));
          });
          transferWasSuccessful({owner, tokenId, approved});
        });

        describe('when called by the approved individual', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, this.to, tokenId, {from: approved}));
          });
          transferWasSuccessful({owner, tokenId, approved});
        });

        describe('when called by the operator', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, this.to, tokenId, {from: operator}));
          });
          transferWasSuccessful({owner, tokenId, approved});
        });

        describe('when called by the owner without an approved user', function () {
          beforeEach(async function () {
            await this.token.approve(ZERO_ADDRESS, tokenId, {from: owner});
            ({logs} = await transferFunction.call(this, owner, this.to, tokenId, {from: operator}));
          });
          transferWasSuccessful({owner, tokenId, approved: null});
        });

        describe('when sent to the owner', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, owner, tokenId, {from: owner}));
          });

          it('keeps ownership of the token', async function () {
            const newOwner = await this.token.ownerOf(tokenId);
            newOwner.should.be.equal(owner);
          });

          it('clears the approval for the token ID', async function () {
            const approvedAccount = await this.token.getApproved(tokenId);
            approvedAccount.should.be.equal(ZERO_ADDRESS);
          });

          it('emits an approval and transfer events', async function () {
            logs.length.should.be.equal(2);
            logs[0].event.should.be.eq('Approval');
            logs[0].args._owner.should.be.equal(owner);
            logs[0].args._approved.should.be.equal(ZERO_ADDRESS);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);

            logs[1].event.should.be.eq('Transfer');
            logs[1].args._from.should.be.equal(owner);
            logs[1].args._to.should.be.equal(owner);
            logs[1].args._tokenId.should.be.bignumber.equal(tokenId);
          });

          it('keeps the owner balance', async function () {
            const ownerBalance = await this.token.balanceOf(owner);
            ownerBalance.should.be.bignumber.equal(2);
          });

          it('keeps same tokens by index', async function () {
            if (!this.token.tokenOfOwnerByIndex) return;
            const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenOfOwnerByIndex(owner, i)));
            tokensListed.map(t => t.toNumber()).should.have.members([firstTokenId, secondTokenId]);
          });
        });

        describe('when the address of the previous owner is incorrect', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, unauthorized, this.to, tokenId, {from: owner}));
          });
        });

        describe('when the sender is not authorized for the token id', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, owner, this.to, tokenId, {from: unauthorized}));
          });
        });

        describe('when the given token ID does not exist', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, owner, this.to, unknownTokenId, {from: owner}));
          });
        });

        describe('when the address to transfer the token to is the zero address', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, owner, ZERO_ADDRESS, tokenId, {from: owner}));
          });
        });
      };

      describe('via transferFrom', function () {
        shouldTransferTokensByUsers(function (from, to, tokenId, opts) {
          return this.token.transferFrom(from, to, tokenId, opts);
        });
      });

      describe('via safeTransferFrom', function () {
        const safeTransferFromWithData = function (from, to, tokenId, opts) {
          return sendTransaction(
            this.token,
            'safeTransferFrom',
            'address,address,uint256,bytes',
            [from, to, tokenId, data],
            opts
          );
        };

        const safeTransferFromWithoutData = function (from, to, tokenId, opts) {
          return this.token.safeTransferFrom(from, to, tokenId, opts);
        };

        const shouldTransferSafely = function (transferFun, data) {
          describe('to a user account', function () {
            shouldTransferTokensByUsers(transferFun);
          });

          describe('to a valid receiver contract', function () {
            beforeEach(async function () {
              this.receiver = await ERC721Receiver.new(RECEIVER_MAGIC_VALUE, false);
              this.to = this.receiver.address;
            });

            shouldTransferTokensByUsers(transferFun);

            it('should call onERC721Received', async function () {
              const result = await transferFun.call(this, owner, this.to, tokenId, {from: owner});
              result.receipt.logs.length.should.be.equal(3);
              const [log] = decodeLogs([result.receipt.logs[2]], ERC721Receiver, this.receiver.address);
              log.event.should.be.eq('Received');
              log.args._address.should.be.equal(owner);
              log.args._tokenId.toNumber().should.be.equal(tokenId);
              log.args._data.should.be.equal(data);
            });
          });
        };

        describe('with data', function () {
          shouldTransferSafely(safeTransferFromWithData, data);
        });

        describe('without data', function () {
          shouldTransferSafely(safeTransferFromWithoutData, '0x');
        });

        describe('to a receiver contract returning unexpected value', function () {
          it('reverts', async function () {
            const invalidReceiver = await ERC721Receiver.new('0x42', false);
            await assertRevert(this.token.safeTransferFrom(owner, invalidReceiver.address, tokenId, {from: owner}));
          });
        });

        describe('to a receiver contract that throws', function () {
          it('reverts', async function () {
            const invalidReceiver = await ERC721Receiver.new(RECEIVER_MAGIC_VALUE, true);
            await assertRevert(this.token.safeTransferFrom(owner, invalidReceiver.address, tokenId, {from: owner}));
          });
        });

        describe('to a contract that does not implement the required function', function () {
          it('reverts', async function () {
            const invalidReceiver = this.token;
            await assertRevert(this.token.safeTransferFrom(owner, invalidReceiver.address, tokenId, {from: owner}));
          });
        });
      });
    });

    describe('approve', function () {
      const tokenId = firstTokenId;
      const sender = curator;
      const to = accounts[1];

      let logs = null;

      const itClearsApproval = function () {
        it('clears approval for the token', async function () {
          const approvedAccount = await this.token.getApproved(tokenId);
          approvedAccount.should.be.equal(ZERO_ADDRESS);
        });
      };

      const itApproves = function (address) {
        it('sets the approval for the target address', async function () {
          const approvedAccount = await this.token.getApproved(tokenId);
          approvedAccount.should.be.equal(address);
        });
      };

      const itEmitsApprovalEvent = function (address) {
        it('emits an approval event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('Approval');
          logs[0].args._owner.should.be.equal(sender);
          logs[0].args._approved.should.be.equal(address);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
        });
      };

      describe('when clearing approval', function () {
        describe('when there was no prior approval', function () {
          beforeEach(async function () {
            ({logs} = await this.token.approve(ZERO_ADDRESS, tokenId, {from: sender}));
          });

          itClearsApproval();

          it('does not emit an approval event', async function () {
            logs.length.should.be.equal(0);
          });
        });

        describe('when there was a prior approval', function () {
          beforeEach(async function () {
            await this.token.approve(to, tokenId, {from: sender});
            ({logs} = await this.token.approve(ZERO_ADDRESS, tokenId, {from: sender}));
          });

          itClearsApproval();
          itEmitsApprovalEvent(ZERO_ADDRESS);
        });
      });

      describe('when approving a non-zero address', function () {
        describe('when there was no prior approval', function () {
          beforeEach(async function () {
            ({logs} = await this.token.approve(to, tokenId, {from: sender}));
          });

          itApproves(to);
          itEmitsApprovalEvent(to);
        });

        describe('when there was a prior approval to the same address', function () {
          beforeEach(async function () {
            await this.token.approve(to, tokenId, {from: sender});
            ({logs} = await this.token.approve(to, tokenId, {from: sender}));
          });

          itApproves(to);
          itEmitsApprovalEvent(to);
        });

        describe('when there was a prior approval to a different address', function () {
          beforeEach(async function () {
            await this.token.approve(accounts[2], tokenId, {from: sender});
            ({logs} = await this.token.approve(to, tokenId, {from: sender}));
          });

          itApproves(to);
          itEmitsApprovalEvent(to);
        });
      });

      describe('when the address that receives the approval is the owner', function () {
        it('reverts', async function () {
          await assertRevert(this.token.approve(sender, tokenId, {from: sender}));
        });
      });

      describe('when the sender does not own the given token ID', function () {
        it('reverts', async function () {
          await assertRevert(this.token.approve(to, tokenId, {from: accounts[2]}));
        });
      });

      describe('when the sender is approved for the given token ID', function () {
        it('reverts', async function () {
          await this.token.approve(accounts[2], tokenId, {from: sender});
          await assertRevert(this.token.approve(to, tokenId, {from: accounts[2]}));
        });
      });

      describe('when the sender is an operator', function () {
        const operator = accounts[2];
        beforeEach(async function () {
          await this.token.setApprovalForAll(operator, true, {from: sender});
          ({logs} = await this.token.approve(to, tokenId, {from: operator}));
        });

        itApproves(to);
        itEmitsApprovalEvent(to);
      });

      describe('when the given token ID does not exist', function () {
        it('reverts', async function () {
          await assertRevert(this.token.approve(to, unknownTokenId, {from: sender}));
        });
      });
    });

    describe('setApprovalForAll', function () {
      const sender = curator;

      describe('when the operator willing to approve is not the owner', function () {
        const operator = accounts[1];

        describe('when there is no operator approval set by the sender', function () {
          it('approves the operator', async function () {
            await this.token.setApprovalForAll(operator, true, {from: sender});

            const isApproved = await this.token.isApprovedForAll(sender, operator);
            isApproved.should.be.true;
          });

          it('emits an approval event', async function () {
            const {logs} = await this.token.setApprovalForAll(operator, true, {from: sender});

            logs.length.should.be.equal(1);
            logs[0].event.should.be.eq('ApprovalForAll');
            logs[0].args._owner.should.be.equal(sender);
            logs[0].args._operator.should.be.equal(operator);
            logs[0].args._approved.should.be.true;
          });
        });

        describe('when the operator was set as not approved', function () {
          beforeEach(async function () {
            await this.token.setApprovalForAll(operator, false, {from: sender});
          });

          it('approves the operator', async function () {
            await this.token.setApprovalForAll(operator, true, {from: sender});

            const isApproved = await this.token.isApprovedForAll(sender, operator);
            isApproved.should.be.true;
          });

          it('emits an approval event', async function () {
            const {logs} = await this.token.setApprovalForAll(operator, true, {from: sender});

            logs.length.should.be.equal(1);
            logs[0].event.should.be.eq('ApprovalForAll');
            logs[0].args._owner.should.be.equal(sender);
            logs[0].args._operator.should.be.equal(operator);
            logs[0].args._approved.should.be.true;
          });

          it('can unset the operator approval', async function () {
            await this.token.setApprovalForAll(operator, false, {from: sender});

            const isApproved = await this.token.isApprovedForAll(sender, operator);
            isApproved.should.be.false;
          });
        });

        describe('when the operator was already approved', function () {
          beforeEach(async function () {
            await this.token.setApprovalForAll(operator, true, {from: sender});
          });

          it('keeps the approval to the given address', async function () {
            await this.token.setApprovalForAll(operator, true, {from: sender});

            const isApproved = await this.token.isApprovedForAll(sender, operator);
            isApproved.should.be.true;
          });

          it('emits an approval event', async function () {
            const {logs} = await this.token.setApprovalForAll(operator, true, {from: sender});

            logs.length.should.be.equal(1);
            logs[0].event.should.be.eq('ApprovalForAll');
            logs[0].args._owner.should.be.equal(sender);
            logs[0].args._operator.should.be.equal(operator);
            logs[0].args._approved.should.be.true;
          });
        });
      });

      describe('when the operator is the owner', function () {
        const operator = curator;

        it('reverts', async function () {
          await assertRevert(this.token.setApprovalForAll(operator, true, {from: sender}));
        });
      });
    });
  });

  describe('like a mintable and burnable ERC721Token', function () {
    beforeEach(async function () {
      await this.token.mint(_tokenURI, _edition1, _artist, _editionName, _typeDigital, _priceInWei, _auctionStartDate, {from: curator});
      await this.token.mint(_tokenURI, _edition2, _artist, _editionName, _typePhysical, _priceInWei, _auctionStartDate, {from: curator});
    });

    describe('mint', function () {
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.mint(_tokenURI, _edition1, _artist, _editionName, _typeDigital, _priceInWei, _auctionStartDate, {from: curator});
          logs = result.logs;
        });

        it('assigns the token to the new owner', async function () {
          const owner = await this.token.ownerOf(3);
          owner.should.be.equal(curator);
        });

        it('increases the balance of its owner', async function () {
          const balance = await this.token.balanceOf(curator);
          balance.should.be.bignumber.equal(3);
        });

        it('emits a transfer event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('Transfer');
          logs[0].args._from.should.be.equal(ZERO_ADDRESS);
          logs[0].args._to.should.be.equal(curator);
          logs[0].args._tokenId.should.be.bignumber.equal(3);
        });
      });

      // TODO re-enable this once we restrictions in SC added
      describe.skip('when the given owner address is the zero address', function () {
        it('reverts', async function () {
          await assertRevert(this.token.mint(ZERO_ADDRESS, tokenId));
        });
      });

      // TODO re-enable this once we restrictions in SC added
      describe.skip('when the given token ID was already tracked by this contract', function () {
        it('reverts', async function () {
          await assertRevert(this.token.mint(accounts[1], firstTokenId));
        });
      });
    });

    describe('burn', function () {
      const tokenId = firstTokenId;
      const sender = curator;
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.burn(tokenId, {from: sender});
          logs = result.logs;
        });

        it('burns the given token ID and adjusts the balance of the owner', async function () {
          await assertRevert(this.token.ownerOf(tokenId));
          const balance = await this.token.balanceOf(sender);
          balance.should.be.bignumber.equal(1);
        });

        it('emits a burn event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('Transfer');
          logs[0].args._from.should.be.equal(sender);
          logs[0].args._to.should.be.equal(ZERO_ADDRESS);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
        });
      });

      describe('when there is a previous approval', function () {
        beforeEach(async function () {
          await this.token.approve(buyer, tokenId, {from: sender});
          const result = await this.token.burn(tokenId, {from: sender});
          logs = result.logs;
        });

        it('clears the approval', async function () {
          const approvedAccount = await this.token.getApproved(tokenId);
          approvedAccount.should.be.equal(ZERO_ADDRESS);
        });

        it('emits an approval event', async function () {
          logs.length.should.be.equal(2);

          logs[0].event.should.be.eq('Approval');
          logs[0].args._owner.should.be.equal(sender);
          logs[0].args._approved.should.be.equal(ZERO_ADDRESS);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);

          logs[1].event.should.be.eq('Transfer');
        });
      });

      describe('when the given token ID was not tracked by this contract', function () {
        it('reverts', async function () {
          await assertRevert(this.token.burn(unknownTokenId, {from: curator}));
        });
      });
    });
  });

  describe('custom functions', function () {

    describe('mint()', function () {
      beforeEach(async function () {
        await this.token.mint(_tokenURI, _edition1, _artist, _editionName, _typeDigital, _priceInWei, _auctionStartDate, {from: curator});
      });

      describe('balanceOf', function () {
        describe('when the given address owns some tokens', function () {
          it('returns the amount of tokens owned by the given address', async function () {
            const balance = await this.token.balanceOf(curator);
            balance.should.be.bignumber.equal(1);
          });
        });
        describe('when the given address does not own any tokens', function () {
          it('returns 0', async function () {
            const balance = await this.token.balanceOf(buyer);
            balance.should.be.bignumber.equal(0);
          });
        });
      });

      describe('assetInfo()', function () {
        it('is fully populated', async function () {
          const assetInfo = await this.token.assetInfo(1);

          let tokenId = assetInfo[0];
          tokenId.should.be.bignumber.equal(1);

          let owner = assetInfo[1];
          owner.should.be.equal(curator);

          let purchaseState = assetInfo[2];
          purchaseState.should.be.bignumber.equal(Unsold);

          let priceInWei = assetInfo[3];
          priceInWei.should.be.bignumber.equal(_priceInWei);

          let auctionStartDate = assetInfo[4];
          auctionStartDate.should.be.bignumber.equal(_auctionStartDate);
        });
      });

      describe('editionInfo()', function () {
        it('is fully populated', async function () {
          const editionInfo = await this.token.editionInfo(1);

          let tokenId = editionInfo[0];
          tokenId.should.be.bignumber.equal(1);

          let type = editionInfo[1];
          type.toString().should.be.equal(_typeDigital);

          let edition = editionInfo[2];
          edition.toString().should.be.equal(_edition1);

          let editionName = editionInfo[3];
          editionName.toString().should.be.equal(_editionName);

          let editionNumber = editionInfo[4];
          editionNumber.should.be.bignumber.equal(1);

          let artist = editionInfo[5];
          artist.toString().should.be.equal(_artist);

          let tokenUri = editionInfo[6];
          tokenUri.toString().should.be.equal(_tokenURI);
        });
      });

      it('editionOf()', async function () {
        const edition = await this.token.editionOf(1);
        edition.toString().should.be.equal(_edition1);
      });

      it('tokenAuctionOpenDate()', async function () {
        const tokenAuctionOpenDate = await this.token.tokenAuctionOpenDate(1);
        tokenAuctionOpenDate.should.be.bignumber.equal(_auctionStartDate);
      });

      it('priceInWei()', async function () {
        const priceInWei = await this.token.priceInWei(1);
        priceInWei.should.be.bignumber.equal(_priceInWei);
      });
    });

    describe('mintEdition()', function () {
      const NUMBER_OF_EDITIONS = 10;

      beforeEach(async function () {
        await this.token.mintEdition(_tokenURI, _edition1, _artist, _editionName, _typeDigital, NUMBER_OF_EDITIONS, _priceInWei, _auctionStartDate, {from: curator});
      });

      describe('balanceOf', function () {
        describe('when the given address owns some tokens', function () {
          it('returns the amount of tokens owned by the given address', async function () {
            const balance = await this.token.balanceOf(curator);
            balance.should.be.bignumber.equal(10);
          });
        });
        describe('when the given address does not own any tokens', function () {
          it('returns 0', async function () {
            const balance = await this.token.balanceOf(buyer);
            balance.should.be.bignumber.equal(0);
          });
        });
      });

      describe('assetInfo()', function () {
        it('is fully populated', async function () {
          const range = _.range(1, NUMBER_OF_EDITIONS);
          for (let id of range) {
            const assetInfo = await this.token.assetInfo(id);

            let tokenId = assetInfo[0];
            tokenId.should.be.bignumber.equal(id);

            let owner = assetInfo[1];
            owner.should.be.equal(curator);

            let purchaseState = assetInfo[2];
            purchaseState.should.be.bignumber.equal(Unsold);

            let priceInWei = assetInfo[3];
            priceInWei.should.be.bignumber.equal(_priceInWei);

            let auctionStartDate = assetInfo[4];
            auctionStartDate.should.be.bignumber.equal(_auctionStartDate);
          }
        });
      });

      describe('editionInfo()', function () {
        it('is fully populated', async function () {
          const range = _.range(1, NUMBER_OF_EDITIONS);
          for (let id of range) {
            let editionInfo = await this.token.editionInfo(id);

            let tokenId = editionInfo[0];
            tokenId.should.be.bignumber.equal(id);

            let type = editionInfo[1];
            type.toString().should.be.equal(_typeDigital);

            let edition = editionInfo[2];
            edition.toString().should.be.equal(_edition1);

            let editionName = editionInfo[3];
            editionName.toString().should.be.equal(_editionName);

            let editionNumber = editionInfo[4];
            editionNumber.should.be.bignumber.equal(id);

            let artist = editionInfo[5];
            artist.toString().should.be.equal(_artist);

            let tokenUri = editionInfo[6];
            tokenUri.toString().should.be.equal(_tokenURI);
          }
        });
      });
    });

    describe('purchaseWithEther()', function () {
      const NUMBER_OF_EDITIONS = 10;
      const tokenToPurchase = new BigNumber(3);

      beforeEach(async function () {
        await this.token.mintEdition(_tokenURI, _edition1, _artist, _editionName, _typeDigital, NUMBER_OF_EDITIONS, _priceInWei, _auctionStartDate, {
          from: curator
        });

        //Ensure all Unsold
        const range = _.range(0, NUMBER_OF_EDITIONS);
        for (let tokenId of range) {
          let isPurchased = await this.token.isPurchased(tokenId);
          isPurchased.should.be.bignumber.equal(Unsold);

          let ownerOf = await this.token.ownerOf(tokenId);
          ownerOf.should.be.equal(curator);
        }

        //Ensure all Ids as expected and owned by curator
        let ownerTokens = await this.token.getOwnerTokens(curator);
        ownerTokens = ownerTokens.map((tokenId) => tokenId.toNumber());
        ownerTokens.should.be.deep.equal(range);
      });

      describe('price in wei', function () {
        it.only('can only purchase if price equal to token value', async function () {
          let {logs} = await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei,
            from: buyer
          });

          logs.length.should.be.equal(4);

          // Approve new buyer
          logs[0].event.should.be.eq('Approval');
          logs[0].args._owner.should.be.equal(curator);
          logs[0].args._approved.should.be.equal(buyer);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // Approval cleared on transfer
          logs[1].event.should.be.eq('Approval');
          logs[1].args._owner.should.be.equal(curator);
          logs[1].args._approved.should.be.equal(ZERO_ADDRESS);
          logs[1].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // Transferred
          logs[2].event.should.be.eq('Transfer');
          logs[2].args._from.should.be.equal(curator);
          logs[2].args._to.should.be.equal(buyer);
          logs[2].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // Internal event fired
          logs[3].event.should.be.eq('PurchasedWithEther');
          logs[3].args._buyer.should.be.equal(buyer);
          logs[3].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(buyer);
        });

        it('fails purchase is price less then', async function () {
          let response = await this.token.purchaseWithEther(tokenToPurchase, {value: _priceInWei - 1, from: buyer});
          response.should.be.equal(false);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });
      });

      describe('can only purchase if unsold', function () {

        beforeEach(async function () {
          let response = await this.token.purchaseWithEther(tokenToPurchase, {value: _priceInWei, from: buyer});
          response.should.be.equal(true);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });

        it('reverts if already sold', async function () {
          await assertRevert(this.token.purchaseWithEther(tokenToPurchase, {value: _priceInWei, from: anotherBuyer}));
        });
      });

      describe('purchasing from different accounts', function () {
        it('can purchase if currently owned by curator', async function () {

        });

        it('can purchase if currently owned by contractDeveloper', async function () {

        });
      });

      it('can only purchase if auction date open', function () {

      });

    });

    describe('purchaseWithFiat()', function () {
      // TODO

      // onlyManagement
      // onlyUnsold(_tokenId)
      // onlyManagementOwnedToken(_tokenId)
      // onlyWhenBuyDateOpen(_tokenId)

      describe('isPurchased()', function () {
        // TODO
      });

    });

    describe('reverseFiatPurchase()', function () {
      // TODO
    });

    describe('setTokenURI()', function () {
      // TODO
      // only management
    });

    describe('setPriceInWei()', function () {
      // TODO
      // onlyManagement
      // onlyUnsold(_tokenId)
      // onlyManagementOwnedToken(_tokenId)
    });

    describe('tokenAuctionOpenDate()', function () {
      it('token should not be available for purchase when auction not started', function () {
        // TODO
      });
    });

  });
});
