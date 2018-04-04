const assertRevert = require('../helpers/assertRevert');
const sendTransaction = require('../helpers/sendTransaction').sendTransaction;
const etherToWei = require('../helpers/etherToWei');

const advanceBlock = require('../helpers/advanceToBlock');
const increaseTimeTo = require('../helpers/increaseTime').increaseTimeTo;
const duration = require('../helpers/increaseTime').duration;
const latestTime = require('../helpers/latestTime');

const _ = require('lodash');

const BigNumber = web3.BigNumber;

const KnownOriginDigitalAsset = artifacts.require('KnownOriginDigitalAsset');
const ERC721Receiver = artifacts.require('ERC721ReceiverMock');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('KnownOriginDigitalAsset', function (accounts) {
  const _curatorAccount = accounts[0];
  const _developmentAccount = accounts[1];
  const _artist = accounts[2];

  const _buyer = accounts[3];
  const _anotherBuyer = accounts[4];

  //Purchase states
  const Unsold = 0;
  const EtherPurchase = 1;
  const FiatPurchase = 2;

  const firstTokenId = 0;
  const secondTokenId = 1;

  const unknownTokenId = 99;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const RECEIVER_MAGIC_VALUE = '0xf0b9e5ba';

  const _baseUri = 'https://ipfs.infura.io/ipfs/'; // FIXME load from contract?
  const _tokenURI = 'abc123';
  const _editionDigital = 'ABC0000000000DIG';
  const _editionPhysical = 'ABC0000000000PHY';

  const _priceInWei = etherToWei(0.5);
  let _purchaseFromTime;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    // developers will mine the contract and pass the curator account into it...
    this.token = await KnownOriginDigitalAsset.new(_curatorAccount, {from: _developmentAccount});
    _purchaseFromTime = latestTime(); // opens immediately

    await increaseTimeTo(_purchaseFromTime + duration.seconds(1)); // force time to move 1 seconds so normal tests pass

    // set base commission rates
    await this.token.updateCommission('DIG', 12, 12, {from: _curatorAccount});
    await this.token.updateCommission('PHY', 24, 15, {from: _curatorAccount});
  });

  describe('like a ERC721BasicToken', function () {
    beforeEach(async function () {
      await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
      await this.token.mint(_tokenURI, _editionPhysical, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
    });

    describe('balanceOf', function () {
      describe('when the given address owns some tokens', function () {
        it('returns the amount of tokens owned by the given address', async function () {
          const balance = await this.token.balanceOf(_curatorAccount);
          balance.should.be.bignumber.equal(2);
        });
      });

      describe('when the given address does not own any tokens', function () {
        it('returns 0', async function () {
          const balance = await this.token.balanceOf(_buyer);
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
          owner.should.be.equal(_curatorAccount);
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

            // TODO find solution to decodeLogs
            it.skip('should call onERC721Received', async function () {
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
      const sender = _curatorAccount;
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
      const sender = _curatorAccount;

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
        const operator = _curatorAccount;

        it('reverts', async function () {
          await assertRevert(this.token.setApprovalForAll(operator, true, {from: sender}));
        });
      });
    });
  });

  describe('like a mintable and burnable ERC721Token', function () {
    beforeEach(async function () {
      const result = await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
        from: _curatorAccount
      });
      await this.token.mint(_tokenURI, _editionPhysical, _priceInWei, _purchaseFromTime, _curatorAccount, {
        from: _curatorAccount
      });
    });

    describe('mint', function () {
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.mint(_tokenURI, 'XYZ0000000000DIG', _priceInWei, _purchaseFromTime, _curatorAccount, {
            from: _curatorAccount
          });
          logs = result.logs;
        });

        it('assigns the token to the new owner', async function () {
          const owner = await this.token.ownerOf(2); // zero indexed
          owner.should.be.equal(_curatorAccount);
        });

        it('increases the balance of its owner', async function () {
          const balance = await this.token.balanceOf(_curatorAccount);
          balance.should.be.bignumber.equal(3);
        });

        it('emits a transfer event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('Transfer');
          logs[0].args._from.should.be.equal(ZERO_ADDRESS);
          logs[0].args._to.should.be.equal(_curatorAccount);
          logs[0].args._tokenId.should.be.bignumber.equal(2);
        });
      });
    });

    describe('burn', function () {
      const tokenId = firstTokenId;
      const sender = _curatorAccount;
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
          await this.token.approve(_buyer, tokenId, {from: sender});
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
          await assertRevert(this.token.burn(unknownTokenId, {from: _curatorAccount}));
        });
      });
    });
  });

  describe('custom functions', function () {

    describe('mint()', function () {
      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      describe('balanceOf', function () {
        describe('when the given address owns some tokens', function () {
          it('returns the amount of tokens owned by the given address', async function () {
            const balance = await this.token.balanceOf(_curatorAccount);
            balance.should.be.bignumber.equal(1);
          });
        });
        describe('when the given address does not own any tokens', function () {
          it('returns 0', async function () {
            const balance = await this.token.balanceOf(_buyer);
            balance.should.be.bignumber.equal(0);
          });
        });
      });

      it('assetInfo() & editionInfo() are fully populated', async function () {
        // Asset info
        const assetInfo = await this.token.assetInfo(firstTokenId);

        let tokenId = assetInfo[0];
        tokenId.should.be.bignumber.equal(firstTokenId);

        let owner = assetInfo[1];
        owner.should.be.equal(_curatorAccount);

        let purchaseState = assetInfo[2];
        purchaseState.should.be.bignumber.equal(Unsold);

        let priceInWei = assetInfo[3];
        priceInWei.should.be.bignumber.equal(_priceInWei);

        let auctionStartDate = assetInfo[4];
        auctionStartDate.should.be.bignumber.equal(_purchaseFromTime);

        // Edition info
        const editionInfo = await this.token.editionInfo(firstTokenId);

        let tokenId2 = editionInfo[0];
        tokenId2.should.be.bignumber.equal(firstTokenId);

        let edition = editionInfo[1];
        web3.toAscii(edition).should.be.equal(_editionDigital);

        let editionNumber = editionInfo[2];
        editionNumber.should.be.bignumber.equal(1);

        let tokenUri = editionInfo[3];
        tokenUri.toString().should.be.equal(_baseUri + _tokenURI);
      });

      it('editionOf()', async function () {
        const edition = await this.token.editionOf(firstTokenId);
        web3.toAscii(edition).should.be.equal(_editionDigital);
      });

      it('tokenAuctionOpenDate()', async function () {
        const purchaseFromTime = await this.token.purchaseFromTime(firstTokenId);
        purchaseFromTime.should.be.bignumber.equal(_purchaseFromTime);
      });

      it('priceInWei()', async function () {
        const priceInWei = await this.token.priceInWei(firstTokenId);
        priceInWei.should.be.bignumber.equal(_priceInWei);
      });
    });

    describe('purchaseWithEther()', function () {
      const NUMBER_OF_EDITIONS = 10;
      const tokenToPurchase = new BigNumber(3);

      beforeEach(async function () {
        const totalInEdition = _.range(0, NUMBER_OF_EDITIONS);
        for (let tokenId of totalInEdition) {
          await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
            from: _curatorAccount
          });
        }

        //Ensure all Unsold
        const range = _.range(0, NUMBER_OF_EDITIONS);
        for (let tokenId of range) {
          let isPurchased = await this.token.isPurchased(tokenId);
          isPurchased.should.be.bignumber.equal(Unsold);

          let ownerOf = await this.token.ownerOf(tokenId);
          ownerOf.should.be.equal(_curatorAccount);
        }

        //Ensure all Ids as expected and owned by _curatorAccount
        let ownerTokens = await this.token.tokensOf(_curatorAccount);
        ownerTokens = ownerTokens.map((tokenId) => tokenId.toNumber());
        ownerTokens.should.be.deep.equal(range);

        let editionInfo = await this.token.editionInfo(firstTokenId);
        editionInfo[2].toNumber().should.be.equal(NUMBER_OF_EDITIONS);
      });

      describe('price in wei', function () {
        it('can only purchase if price equal to token value', async function () {

          let {logs} = await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei,
            from: _buyer
          });

          logs.length.should.be.equal(4);

          // Approve new _buyer
          logs[0].event.should.be.eq('Approval');
          logs[0].args._owner.should.be.equal(_curatorAccount);
          logs[0].args._approved.should.be.equal(_buyer);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // Approval cleared on transfer
          logs[1].event.should.be.eq('Approval');
          logs[1].args._owner.should.be.equal(_curatorAccount);
          logs[1].args._approved.should.be.equal(ZERO_ADDRESS);
          logs[1].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // Transferred
          logs[2].event.should.be.eq('Transfer');
          logs[2].args._from.should.be.equal(_curatorAccount);
          logs[2].args._to.should.be.equal(_buyer);
          logs[2].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // Internal event fired
          logs[3].event.should.be.eq('PurchasedWithEther');
          logs[3].args._buyer.should.be.equal(_buyer);
          logs[3].args._tokenId.should.be.bignumber.equal(tokenToPurchase);

          // check is purchased with ether
          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);

          // check token is now the owner
          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_buyer);

          // check approval of sold token reset to zero
          let getApproved = await this.token.getApproved(tokenToPurchase);
          getApproved.should.be.equal(ZERO_ADDRESS);

          //Ensure _curatorAccount still owns all bu the purchased token
          let ownerTokens = await this.token.tokensOf(_curatorAccount);
          ownerTokens = ownerTokens.map((tokenId) => tokenId.toNumber());
          ownerTokens.sort().should.be.deep.equal([0, 1, 2, 4, 5, 6, 7, 8, 9]);
        });

        it('succeeds purchase is price greater than amount asked for', async function () {
          await this.token.purchaseWithEther(tokenToPurchase, {value: _priceInWei.add(1), from: _buyer});

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_buyer);
        });

        it('fails purchase is price less than amount asked for', async function () {
          await assertRevert(this.token.purchaseWithEther(tokenToPurchase, {value: _priceInWei.sub(1), from: _buyer}));

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(Unsold);

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_curatorAccount);
        });
      });

      describe('can only purchase if unsold', function () {

        beforeEach(async function () {
          await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei,
            from: _buyer
          });

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_buyer);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });

        it('reverts if already sold', async function () {
          await assertRevert(this.token.purchaseWithEther(tokenToPurchase, {value: _priceInWei, from: _anotherBuyer}));
        });
      });

      describe('purchasing from different accounts', function () {
        it('can purchase if currently owned by _curatorAccount', async function () {
          await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei,
            from: _curatorAccount
          });

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_curatorAccount);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });

        it('can purchase if currently owned by contractDeveloper', async function () {
          await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei,
            from: _developmentAccount
          });

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_developmentAccount);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });
      });

      describe('should not transfer ownership if artwork has value and purchaser sends zero', function () {
        it('should fail with invalid amount', async function () {
          await assertRevert(this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei.sub(1),
            from: _buyer
          }));

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_curatorAccount);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(Unsold);
        });
      });

      describe('should transfer ownership if artwork has value is the same', function () {
        it('should transfer ownership', async function () {
          await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei,
            from: _buyer
          });

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_buyer);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });
      });

      describe('should transfer ownership if artwork has value is greater', function () {
        it('should transfer ownership', async function () {
          await this.token.purchaseWithEther(tokenToPurchase, {
            value: _priceInWei.add(1),
            from: _buyer
          });

          let ownerOf = await this.token.ownerOf(tokenToPurchase);
          ownerOf.should.be.equal(_buyer);

          let isPurchased = await this.token.isPurchased(tokenToPurchase);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });
      });
    });

    describe('can only purchase if auction date open', function () {

      beforeEach(async function () {
        _purchaseFromTime += duration.seconds(30);
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      it('should not be able to buy with fiat yet', async function () {
        await assertRevert(this.token.purchaseWithFiat(firstTokenId, {from: _buyer}));
      });

      it('should not be able to buy with ether yet', async function () {
        await assertRevert(this.token.purchaseWithEther(firstTokenId, {value: _priceInWei, from: _buyer}));
      });

      describe('purchaseWithFiat()', async function () {

        beforeEach(async function () {
          await increaseTimeTo(_purchaseFromTime + duration.seconds(60));
        });

        it('should be able to buy once open', async function () {
          await this.token.purchaseWithFiat(firstTokenId, {
            from: _curatorAccount
          });

          let ownerOf = await this.token.ownerOf(firstTokenId);
          ownerOf.should.be.equal(_curatorAccount);

          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(FiatPurchase);
        });
      });

      describe('purchaseWithEther()', async function () {

        beforeEach(async function () {
          await increaseTimeTo(_purchaseFromTime + duration.seconds(60));
        });

        it('should be able to buy once open', async function () {
          await this.token.purchaseWithEther(firstTokenId, {
            value: _priceInWei,
            from: _buyer
          });

          let ownerOf = await this.token.ownerOf(firstTokenId);
          ownerOf.should.be.equal(_buyer);

          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });

      });
    });

    describe('purchaseWithFiat()', function () {
      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });

        let isPurchased = await this.token.isPurchased(firstTokenId);
        isPurchased.should.be.bignumber.equal(Unsold);

        let ownerOf = await this.token.ownerOf(firstTokenId);
        ownerOf.should.be.equal(_curatorAccount);
      });

      describe('can actually make purchaseWithFiat() if _curatorAccount', function () {
        it('updates owner and sets as sold', async function () {
          let {logs} = await this.token.purchaseWithFiat(new BigNumber(firstTokenId), {
            from: _developmentAccount
          });

          let ownerOf = await this.token.ownerOf(firstTokenId);
          ownerOf.should.be.equal(_curatorAccount);

          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(FiatPurchase);

          //emit correct logs
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('PurchasedWithFiat');
          logs[0].args._tokenId.should.be.bignumber.equal(firstTokenId);
        });
      });

      describe('only if not already sold via purchaseWithEther()', function () {
        beforeEach(async function () {
          await this.token.purchaseWithEther(firstTokenId, {
            value: _priceInWei,
            from: _buyer
          });
          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(EtherPurchase);
        });

        it('reverts if already sold', async function () {
          await assertRevert(this.token.purchaseWithFiat(firstTokenId, {
            from: _anotherBuyer
          }));
        });
      });

      describe('only if not already sold via purchaseWithFiat()', function () {
        beforeEach(async function () {
          await this.token.purchaseWithFiat(firstTokenId, {
            from: _developmentAccount
          });
          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(FiatPurchase);
        });

        it('reverts if already sold', async function () {
          await assertRevert(this.token.purchaseWithFiat(firstTokenId, {
            from: _curatorAccount
          }));
        });
      });

      it('reverts if called by _buyer', async function () {
        await assertRevert(this.token.purchaseWithFiat(firstTokenId, {from: _anotherBuyer}));
      });

      it('reverts if called by another _buyer', async function () {
        await assertRevert(this.token.purchaseWithFiat(firstTokenId, {from: _anotherBuyer}));
      });
    });

    describe('reverseFiatPurchase()', function () {
      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      it('cannot reverse token which is unsold', async function () {
        await assertRevert(this.token.reverseFiatPurchase(firstTokenId));
      });

      it('cannot reverse token which is purchased with ether', async function () {
        await this.token.purchaseWithEther(firstTokenId, {
          value: _priceInWei,
          from: _buyer
        });

        let isPurchased = await this.token.isPurchased(firstTokenId);
        isPurchased.should.be.bignumber.equal(EtherPurchase);

        await assertRevert(this.token.reverseFiatPurchase(firstTokenId));
      });

      describe('once purchased with fiat', async function () {

        beforeEach(async function () {
          await this.token.purchaseWithFiat(firstTokenId, {
            from: _developmentAccount
          });
          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(FiatPurchase);
        });

        describe('can be called by _curatorAccount', async function () {
          it('and is successful', async function () {
            let {logs} = await this.token.reverseFiatPurchase(firstTokenId, {from: _curatorAccount});

            let isPurchased = await this.token.isPurchased(firstTokenId);
            isPurchased.should.be.bignumber.equal(Unsold);

            logs.length.should.be.equal(1);
            logs[0].event.should.be.eq('PurchasedWithFiatReversed');
            logs[0].args._tokenId.should.be.bignumber.equal(firstTokenId);
          });
        });

        describe('can be called by developer', async function () {
          it('and is successful', async function () {
            let {logs} = await this.token.reverseFiatPurchase(firstTokenId, {from: _developmentAccount});

            let isPurchased = await this.token.isPurchased(firstTokenId);
            isPurchased.should.be.bignumber.equal(Unsold);

            logs.length.should.be.equal(1);
            logs[0].event.should.be.eq('PurchasedWithFiatReversed');
            logs[0].args._tokenId.should.be.bignumber.equal(firstTokenId);
          });
        });

        it('cannot be called by _buyer', async function () {
          await assertRevert(this.token.reverseFiatPurchase(firstTokenId, {from: _buyer}));
        });
      });
    });

    describe('setTokenURI()', function () {

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      it('can be called by _curatorAccount', async function () {
        await this.token.setTokenURI(firstTokenId, 'hash/1', {
          from: _curatorAccount
        });
        let editionInfo = await this.token.editionInfo(firstTokenId);
        editionInfo[3].should.be.equal(_baseUri + 'hash/1');
      });

      it('can be called by developer', async function () {
        await this.token.setTokenURI(firstTokenId, 'hash/2', {
          from: _developmentAccount
        });
        let editionInfo = await this.token.editionInfo(firstTokenId);
        editionInfo[3].should.be.equal(_baseUri + 'hash/2');
      });

      it('will fail if called by _buyer', async function () {
        await assertRevert(this.token.setTokenURI(firstTokenId, 'hash/3', {
          from: _buyer
        }));

        let editionInfo = await this.token.editionInfo(firstTokenId);
        editionInfo[3].should.be.equal(_baseUri + _tokenURI);
      });
    });

    describe('setPriceInWei()', function () {
      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      it('can be called by _curatorAccount', async function () {
        await this.token.setPriceInWei(firstTokenId, _priceInWei.add(1), {
          from: _curatorAccount
        });
        let assetInfo = await this.token.assetInfo(firstTokenId);
        assetInfo[3].should.be.bignumber.equal(_priceInWei.add(1));
      });

      it('can be called by developer', async function () {
        await this.token.setPriceInWei(firstTokenId, _priceInWei.sub(1), {
          from: _developmentAccount
        });
        let assetInfo = await this.token.assetInfo(firstTokenId);
        assetInfo[3].should.be.bignumber.equal(_priceInWei.sub(1));
      });

      it('will fail if called by _buyer', async function () {
        await assertRevert(this.token.setPriceInWei(firstTokenId, _priceInWei.sub(1), {
          from: _buyer
        }));
      });

      describe('once purchased', async function () {
        beforeEach(async function () {
          await this.token.purchaseWithFiat(firstTokenId, {
            from: _developmentAccount
          });
          let isPurchased = await this.token.isPurchased(firstTokenId);
          isPurchased.should.be.bignumber.equal(FiatPurchase);
        });

        it('cannot be called', async function () {
          await assertRevert(this.token.setPriceInWei(firstTokenId, _priceInWei.sub(1), {
            from: _curatorAccount
          }));
        });
      });
    });

  });

  describe('commission structure', function () {

    it('should get default commission for contract', async function () {
      let commission = await this.token.getCommissionForType('DIG');
      commission[0].should.be.bignumber.equal(12);
      commission[1].should.be.bignumber.equal(12);

      commission = await this.token.getCommissionForType('PHY');
      commission[0].should.be.bignumber.equal(24);
      commission[1].should.be.bignumber.equal(15);
    });

    it('should get type from edition', async function () {
      let type = await this.token.getTypeFromEdition('ABC0000000000DIG');
      type.should.be.equal('DIG');

      type = await this.token.getTypeFromEdition('ABC0000000000PHY');
      type.should.be.equal('PHY');

      type = await this.token.getTypeFromEdition('ABC0000000000ABC');
      type.should.be.equal('ABC');
    });

    it('convert DIG to bytes', async function () {
      console.log(web3.fromAscii('DIG')); // 0x444947
      console.log(web3.fromAscii('PHY')); // 0x504859
    });

    describe('updating commission', function () {

      it('should be able to update as _curatorAccount', async function () {
        let commission = await this.token.getCommissionForType('DIG');
        commission[0].should.be.bignumber.equal(12);
        commission[1].should.be.bignumber.equal(12);

        await this.token.updateCommission('DIG', 5, 5, {from: _curatorAccount});

        commission = await this.token.getCommissionForType('DIG');
        commission[0].should.be.bignumber.equal(5);
        commission[1].should.be.bignumber.equal(5);
      });

      it('should be able to update as developer', async function () {
        let commission = await this.token.getCommissionForType('DIG');
        commission[0].should.be.bignumber.equal(12);
        commission[1].should.be.bignumber.equal(12);

        await this.token.updateCommission('DIG', 1, 2, {from: _developmentAccount});

        commission = await this.token.getCommissionForType('DIG');
        commission[0].should.be.bignumber.equal(1);
        commission[1].should.be.bignumber.equal(2);
      });

      it('should fail when _buyer', async function () {
        await assertRevert(this.token.updateCommission('ABC', 50, 0, {from: _buyer}));
      });

      it('should fail when _curatorAccount commission is zero', async function () {
        await assertRevert(this.token.updateCommission('ABC', 0, 50, {from: _curatorAccount}));
      });

      it('should fail when developer commission is zero', async function () {
        await assertRevert(this.token.updateCommission('ABC', 50, 0, {from: _curatorAccount}));
      });

      it('should fail when both commissions are greater than 99', async function () {
        await assertRevert(this.token.updateCommission('ABC', 98, 2, {from: _curatorAccount}));
      });

      it('should be able to add a new commission', async function () {
        let commission = await this.token.getCommissionForType('ABC');
        commission[0].should.be.bignumber.equal(0);
        commission[1].should.be.bignumber.equal(0);

        await this.token.updateCommission('ABC', 30, 20, {from: _developmentAccount});

        commission = await this.token.getCommissionForType('ABC');
        commission[0].should.be.bignumber.equal(30);
        commission[1].should.be.bignumber.equal(20);
      });

      it('should fail when updating curator commission with decimals', async function () {
        this.token.updateCommission('EFG', 98, 1.9, {from: _curatorAccount});
        let commission = await this.token.getCommissionForType('EFG');
        commission[0].should.be.bignumber.equal(98);
        commission[1].should.be.bignumber.equal(1);
      });

      it('should fail when updating developer commission with decimals', async function () {
        this.token.updateCommission('EFG', 1.9, 98, {from: _curatorAccount});
        let commission = await this.token.getCommissionForType('EFG');
        commission[0].should.be.bignumber.equal(1);
        commission[1].should.be.bignumber.equal(98);
      });
    });

    describe('allocating commissions for digital purchases', function () {

      const tokenToPurchase = 0;

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
        this.curatorBalance = await web3.eth.getBalance(_curatorAccount);
        this.contractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);

        await this.token.purchaseWithEther(tokenToPurchase, {
          value: _priceInWei,
          from: _buyer
        });

        let ownerOf = await this.token.ownerOf(tokenToPurchase);
        ownerOf.should.be.equal(_buyer);

        let isPurchased = await this.token.isPurchased(tokenToPurchase);
        isPurchased.should.be.bignumber.equal(EtherPurchase);
      });

      it('curator account receives correct value', async function () {
        let updatedCuratorBalance = await web3.eth.getBalance(_curatorAccount);

        // curator is set as the artist account (as artist may not have account)
        // therefore curator gets the artist amount (to forward on)
        updatedCuratorBalance.should.be.bignumber.equal(
          this.curatorBalance
            .add(_priceInWei.dividedBy(100).times(12))
            .add(_priceInWei.dividedBy(100).times(76)) // 12% + 76%
        );
      });

      it('developer account receives correct value', async function () {
        let updatedContractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        updatedContractDeveloperBalance.should.be.bignumber.equal(
          this.contractDeveloperBalance.add(_priceInWei.dividedBy(100).times(12)) // 12%
        );
      });
    });

    describe('allocating commissions for digital purchases with artist address', function () {

      const tokenToPurchase = 0;

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _artist, {
          from: _curatorAccount
        });
        this.curatorBalance = await web3.eth.getBalance(_curatorAccount);
        this.contractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        this.artistBalance = await web3.eth.getBalance(_artist);

        await this.token.purchaseWithEther(tokenToPurchase, {
          value: _priceInWei,
          from: _buyer
        });

        let ownerOf = await this.token.ownerOf(tokenToPurchase);
        ownerOf.should.be.equal(_buyer);

        let isPurchased = await this.token.isPurchased(tokenToPurchase);
        isPurchased.should.be.bignumber.equal(EtherPurchase);
      });

      it('curator account receives correct value', async function () {
        let updatedCuratorBalance = await web3.eth.getBalance(_curatorAccount);

        updatedCuratorBalance.should.be.bignumber.equal(
          this.curatorBalance
            .add(_priceInWei.dividedBy(100).times(12))
        );
      });

      it('developer account receives correct value', async function () {
        let updatedContractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        updatedContractDeveloperBalance.should.be.bignumber.equal(
          this.contractDeveloperBalance.add(_priceInWei.dividedBy(100).times(12)) // 12%
        );
      });

      it('artist account receives correct value', async function () {
        let updatedArtistBalance = await web3.eth.getBalance(_artist);
        updatedArtistBalance.should.be.bignumber.equal(
          this.artistBalance.add(_priceInWei.dividedBy(100).times(76)) // 76%%
        );
      });
    });

    describe('allocating commissions for digital purchases with zero artist address', function () {

      it('should revert as not allowed', async function () {
        await assertRevert(this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, ZERO_ADDRESS, {
          from: _curatorAccount
        }));
      });
    });

    describe('allocating commissions - physical', function () {

      const tokenToPurchase = 0;

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionPhysical, _priceInWei, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
        this.curatorBalance = await web3.eth.getBalance(_curatorAccount);
        this.contractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);

        await this.token.purchaseWithEther(tokenToPurchase, {
          value: _priceInWei,
          from: _buyer
        });

        let ownerOf = await this.token.ownerOf(tokenToPurchase);
        ownerOf.should.be.equal(_buyer);

        let isPurchased = await this.token.isPurchased(tokenToPurchase);
        isPurchased.should.be.bignumber.equal(EtherPurchase);
      });

      it('curator account receives correct value', async function () {
        let updatedCuratorBalance = await web3.eth.getBalance(_curatorAccount);
        updatedCuratorBalance.should.be.bignumber.equal(
          this.curatorBalance
            .add(_priceInWei.dividedBy(100).times(24)) // 24%
            .add(_priceInWei.dividedBy(100).times(61)) // 61%
        );
      });

      it('developer account receives correct value', async function () {
        let updatedContractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        updatedContractDeveloperBalance.should.be.bignumber.equal(
          this.contractDeveloperBalance.add(_priceInWei.dividedBy(100).times(15))// 15%
        );
      });

    });

    describe('missing commission rates still allow purchase', function () {

      const tokenToPurchase = 0;
      const _editionWithMissingType = 'ABC0000000000MIA';

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionWithMissingType, _priceInWei, _purchaseFromTime, _artist, {
          from: _curatorAccount
        });
        this.curatorBalance = await web3.eth.getBalance(_curatorAccount);
        this.contractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        this.artistBalance = await web3.eth.getBalance(_artist);

        await this.token.purchaseWithEther(tokenToPurchase, {
          value: _priceInWei,
          from: _buyer
        });

        let ownerOf = await this.token.ownerOf(tokenToPurchase);
        ownerOf.should.be.equal(_buyer);

        let isPurchased = await this.token.isPurchased(tokenToPurchase);
        isPurchased.should.be.bignumber.equal(EtherPurchase);
      });

      it('curator account receives correct value', async function () {
        let updatedCuratorBalance = await web3.eth.getBalance(_curatorAccount);
        updatedCuratorBalance.should.be.bignumber.equal(this.curatorBalance);
      });

      it('developer account receives correct value', async function () {
        let updatedContractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        updatedContractDeveloperBalance.should.be.bignumber.equal(this.contractDeveloperBalance);
      });

      it('commission account receives correct value', async function () {
        let updatedArtistBalance = await web3.eth.getBalance(_artist);
        updatedArtistBalance.should.be.bignumber.equal(
          this.artistBalance.add(_priceInWei)
        );
      });

    });

    describe('if the artwork is free, no commission is applied', function () {

      const tokenToPurchase = 0;

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionPhysical, 0, _purchaseFromTime, _artist, {
          from: _curatorAccount
        });
        this.curatorBalance = await web3.eth.getBalance(_curatorAccount);
        this.contractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        this.artistBalance = await web3.eth.getBalance(_artist);

        await this.token.purchaseWithEther(tokenToPurchase, {
          from: _buyer
        });

        let ownerOf = await this.token.ownerOf(tokenToPurchase);
        ownerOf.should.be.equal(_buyer);

        let isPurchased = await this.token.isPurchased(tokenToPurchase);
        isPurchased.should.be.bignumber.equal(EtherPurchase);
      });

      it('curator account receives correct value of zero', async function () {
        let updatedCuratorBalance = await web3.eth.getBalance(_curatorAccount);
        updatedCuratorBalance.should.be.bignumber.equal(this.curatorBalance);
      });

      it('developer account receives correct value of zero', async function () {
        let updatedContractDeveloperBalance = await web3.eth.getBalance(_developmentAccount);
        updatedContractDeveloperBalance.should.be.bignumber.equal(this.contractDeveloperBalance);
      });

      it('artist account receives correct value of zero', async function () {
        let updatedArtistBalance = await web3.eth.getBalance(_artist);
        updatedArtistBalance.should.be.bignumber.equal(this.artistBalance);
      });

    });

    describe('can re-set token base URI', function () {

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionPhysical, 0, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      it('should adjust base URI', async function () {
        let uri = await this.token.tokenURI(0);
        uri.should.be.equal(_baseUri + _tokenURI);

        const newBaseUri = 'http://custom.com';
        await this.token.setTokenBaseURI(newBaseUri);

        uri = await this.token.tokenURI(0);
        uri.should.be.equal(newBaseUri + _tokenURI);
      });
    });

    describe('fallback function', function () {

      beforeEach(async function () {
        await this.token.mint(_tokenURI, _editionPhysical, 0, _purchaseFromTime, _curatorAccount, {
          from: _curatorAccount
        });
      });

      it('should revert and not accept value', async function () {
        await assertRevert(this.token.send(1));
      });
    });
  });

  describe('ERC165 supportsInterface()', async function () {

    describe('supports ERC165', async function () {
      it('matches correct bytes', async function () {
        let supportsERC165 = await this.token.supportsInterface('0x01ffc9a7');
        supportsERC165.should.be.equal.true;
      });
    });

    describe('supports ERC721Enumerable', async function () {
      it('matches correct bytes', async function () {
        let supportsERC721Enumerable = await this.token.supportsInterface('0x780e9d63');
        supportsERC721Enumerable.should.be.equal.true;
      });
      it('supports totalSupply()', async function () {
        let support = await this.token.supportsInterface('0x18160ddd');
        support.should.be.equal.true;
      });
      it('supports tokenOfOwnerByIndex()', async function () {
        let support = await this.token.supportsInterface('0x2f745c59');
        support.should.be.equal.true;
      });
      it('supports tokenByIndex()', async function () {
        let support = await this.token.supportsInterface('0x4f6ccce7');
        support.should.be.equal.true;
      });
    });

    describe('supports ERC721Metadata', async function () {
      it('matches correct bytes', async function () {
        let supportsERC721Metadata = await this.token.supportsInterface('0x5b5e139f');
        supportsERC721Metadata.should.be.equal.true;
      });
      it('supports symbol()', async function () {
        let support = await this.token.supportsInterface('0x06fdde03');
        support.should.be.equal.true;
      });
      it('supports totalSupply()', async function () {
        let support = await this.token.supportsInterface('0x95d89b41');
        support.should.be.equal.true;
      });
      it('supports tokenURI()', async function () {
        let support = await this.token.supportsInterface('0xc87b56dd');
        support.should.be.equal.true;
      });
    });

    describe('supports ERC721', async function () {
      it('matches correct bytes', async function () {
        let supportsERC721 = await this.token.supportsInterface('0xcff9d6b4');
        supportsERC721.should.be.equal.true;
      });
      it('supports balanceOf()', async function () {
        let support = await this.token.supportsInterface('0x70a08231');
        support.should.be.equal.true;
      });
      it('supports ownerOf()', async function () {
        let support = await this.token.supportsInterface('0x6352211e');
        support.should.be.equal.true;
      });
      it('supports approve()', async function () {
        let support = await this.token.supportsInterface('0x095ea7b3');
        support.should.be.equal.true;
      });
      it('supports getApproved()', async function () {
        let support = await this.token.supportsInterface('0x081812fc');
        support.should.be.equal.true;
      });
      it('supports setApprovalForAll()', async function () {
        let support = await this.token.supportsInterface('0xa22cb465');
        support.should.be.equal.true;
      });
      it('supports isApprovedForAll()', async function () {
        let support = await this.token.supportsInterface('0xe985e9c5');
        support.should.be.equal.true;
      });
      it('supports transferFrom()', async function () {
        let support = await this.token.supportsInterface('0x23b872dd');
        support.should.be.equal.true;
      });
      it('supports safeTransferFrom()', async function () {
        let support = await this.token.supportsInterface('0x42842e0e');
        support.should.be.equal.true;
      });
      it('supports safeTransferFrom() overloaded with bytes', async function () {
        let support = await this.token.supportsInterface('0xb88d4fde');
        support.should.be.equal.true;
      });
    });

    describe('supports ERC721 optional', async function () {
      it('supports exists()', async function () {
        let support = await this.token.supportsInterface('0x4f558e79');
        support.should.be.equal.true;
      });
    });

    describe('doesnt support missing feature', async function () {
      it('fails to match something which doesnt exist', async function () {
        let supportsERC165 = await this.token.supportsInterface('someOtherValue');
        supportsERC165.should.be.equal.false;
      });
    });
  });

  describe('Burning tokens', async function () {

    const tokenToBurn = 1;

    beforeEach(async function () {
      // Mint three editions
      await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
      await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
      await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});

      const balance = await this.token.balanceOf(_curatorAccount);
      balance.should.be.bignumber.equal(3);
    });

    describe('can only be called by management', async function () {
      it('reverts when called by non management', async function () {
        await assertRevert(this.token.burn(1, {from: _buyer}));
      });

      it('reverts when called by another non management', async function () {
        await assertRevert(this.token.burn(2, {from: _anotherBuyer}));
      });
    });

    describe('keeps track of the token ID pointer', async function () {
      it('tracks id correctly even after burn', async function () {
        let tokenIdPointer = await this.token.tokenIdPointer();
        tokenIdPointer.should.be.bignumber.equal(3); // zero indexed

        await this.token.burn(2, {from: _curatorAccount});

        tokenIdPointer = await this.token.tokenIdPointer();
        tokenIdPointer.should.be.bignumber.equal(3); // zero indexed
      });
    });

    describe('keeps track of the edition total number correctly', async function () {
      it('tracks total in edition correctly', async function () {
        let editionNumber = await this.token.numberOf(_editionDigital);
        editionNumber.should.be.bignumber.equal(3);

        await this.token.burn(2, {from: _curatorAccount});

        editionNumber = await this.token.numberOf(_editionDigital);
        editionNumber.should.be.bignumber.equal(2);
      });
    });

    describe('removes reference to internal data', async function () {

      beforeEach(async function () {
        // burn the middle token
        await this.token.burn(tokenToBurn, {from: _curatorAccount});
      });

      it('tokensOf() is correct', async function () {
        let ownerTokens = await this.token.tokensOf(_curatorAccount);
        ownerTokens = ownerTokens.map((tokenId) => tokenId.toNumber());
        ownerTokens.should.be.deep.equal([0, 2]);
      });

      it('balanceOf() is reduced', async function () {
        const balance = await this.token.balanceOf(_curatorAccount);
        balance.should.be.bignumber.equal(2);
      });

      it('should not exist', async function () {
        const result = await this.token.exists(tokenToBurn);
        result.should.be.false;
      });

      it('should not be purchased', async function () {
        await assertRevert(this.token.isPurchased(tokenToBurn));
      });

      it('should not have editionOf', async function () {
        await assertRevert(this.token.editionOf(tokenToBurn));
      });

      it('should not have purchaseFromTime', async function () {
        await assertRevert(this.token.purchaseFromTime(tokenToBurn));
      });

      it('should not have priceInWei', async function () {
        await assertRevert(this.token.priceInWei(tokenToBurn));
      });

      it('should not have tokenURI', async function () {
        let tokenUri = await this.token.tokenURI(tokenToBurn);
        tokenUri.toString().should.be.equal(_baseUri);
      });

      it('assetInfo() returns missing data', async function () {
        const assetInfo = await this.token.assetInfo(tokenToBurn);

        let tokenId = assetInfo[0];
        tokenId.should.be.bignumber.equal(tokenToBurn);

        let owner = assetInfo[1];
        owner.should.be.equal(ZERO_ADDRESS);

        let purchaseState = assetInfo[2];
        purchaseState.should.be.bignumber.equal(Unsold);

        let priceInWei = assetInfo[3];
        priceInWei.should.be.bignumber.equal(0);

        let auctionStartDate = assetInfo[4];
        auctionStartDate.should.be.bignumber.equal(0);
      });

      it('editionInfo() returns missing data', async function () {
        let editionInfo = await this.token.editionInfo(tokenToBurn);

        let tokenId = editionInfo[0];
        tokenId.should.be.bignumber.equal(tokenToBurn);

        let edition = editionInfo[1];
        web3.toAscii(edition).should.be.equal(
          '\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000'
        );

        let editionNumber = editionInfo[2];
        editionNumber.should.be.bignumber.equal(0);

        let tokenUri = editionInfo[3];
        tokenUri.toString().should.be.equal(_baseUri);
      });
    });

    describe('minting new assets of the same edition still works', async function () {

      beforeEach(async function () {
        const totalSupply = await this.token.totalSupply();
        totalSupply.should.be.bignumber.equal(3);

        let editionNumber = await this.token.numberOf(_editionDigital);
        editionNumber.should.be.bignumber.equal(3);

        // Burn 1
        await this.token.burn(tokenToBurn, {from: _curatorAccount});

        // Add two new assets to the existing digital asset where one has been burnt
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
        await this.token.mint(_tokenURI, _editionDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
      });

      it('tracks total in edition correctly', async function () {
        let editionNumber = await this.token.numberOf(_editionDigital);
        editionNumber.should.be.bignumber.equal(4);
      });

      it('balanceOf() is correct', async function () {
        const totalSupply = await this.token.totalSupply();
        totalSupply.should.be.bignumber.equal(4);
      });

      it('balanceOf() is correct', async function () {
        const balance = await this.token.balanceOf(_curatorAccount);
        balance.should.be.bignumber.equal(4);
      });

      it('tokensOf() is correct', async function () {
        let ownerTokens = await this.token.tokensOf(_curatorAccount);
        ownerTokens = ownerTokens.map((tokenId) => tokenId.toNumber());
        ownerTokens.should.be.deep.equal([0, 2, 3, 4]);
      });

      it('should exists', async function () {
        let result = await this.token.exists(3);
        result.should.be.true;

        result = await this.token.exists(4);
        result.should.be.true;
      });

      it('assetInfo() returns correct data', async function () {
        const assetInfo = await this.token.assetInfo(3);

        let tokenId = assetInfo[0];
        tokenId.should.be.bignumber.equal(3);

        let owner = assetInfo[1];
        owner.should.be.equal(_curatorAccount);

        let purchaseState = assetInfo[2];
        purchaseState.should.be.bignumber.equal(Unsold);

        let priceInWei = assetInfo[3];
        priceInWei.should.be.bignumber.equal(priceInWei);

        let auctionStartDate = assetInfo[4];
        auctionStartDate.should.be.bignumber.equal(auctionStartDate);
      });

      it('editionInfo() returns correct data', async function () {
        let editionInfo = await this.token.editionInfo(3);

        let tokenId = editionInfo[0];
        tokenId.should.be.bignumber.equal(3);

        let edition = editionInfo[1];
        web3.toAscii(edition).should.be.equal(_editionDigital);

        // mint 0,1,2 | burn 2 | mint 3,4 = total of 4 with zero index
        let editionNumber = editionInfo[2];
        editionNumber.should.be.bignumber.equal(4);

        let tokenUri = editionInfo[3];
        tokenUri.toString().should.be.equal(_baseUri + _tokenURI);
      });
    });

    describe('minting new assets under a new edition still works', async function () {

      const newlyMintedTokenId = 3;

      beforeEach(async function () {
        await this.token.burn(tokenToBurn, {from: _curatorAccount});
        //new physical asset
        await this.token.mint(_tokenURI, _editionPhysical, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
      });

      it('totalSupply() is correct', async function () {
        const totalSupply = await this.token.totalSupply();
        totalSupply.should.be.bignumber.equal(3);
      });

      it('balanceOf() is correct', async function () {
        const balance = await this.token.balanceOf(_curatorAccount);
        balance.should.be.bignumber.equal(3);
      });

      it('tokensOf() is correct', async function () {
        let ownerTokens = await this.token.tokensOf(_curatorAccount);
        ownerTokens = ownerTokens.map((tokenId) => tokenId.toNumber());
        ownerTokens.should.be.deep.equal([0, 2, newlyMintedTokenId]);
      });

      it('should exists', async function () {
        const result = await this.token.exists(newlyMintedTokenId);
        result.should.be.true;
      });

      it('assetInfo() returns correct data', async function () {
        const assetInfo = await this.token.assetInfo(newlyMintedTokenId);

        let tokenId = assetInfo[0];
        tokenId.should.be.bignumber.equal(newlyMintedTokenId);

        let owner = assetInfo[1];
        owner.should.be.equal(_curatorAccount);

        let purchaseState = assetInfo[2];
        purchaseState.should.be.bignumber.equal(Unsold);

        let priceInWei = assetInfo[3];
        priceInWei.should.be.bignumber.equal(priceInWei);

        let auctionStartDate = assetInfo[4];
        auctionStartDate.should.be.bignumber.equal(auctionStartDate);
      });

      it('editionInfo() returns correct data', async function () {
        let editionInfo = await this.token.editionInfo(newlyMintedTokenId);

        let tokenId = editionInfo[0];
        tokenId.should.be.bignumber.equal(newlyMintedTokenId);

        let edition = editionInfo[1];
        web3.toAscii(edition).should.be.equal(_editionPhysical);

        let editionNumber = editionInfo[2];
        editionNumber.should.be.bignumber.equal(1);

        let tokenUri = editionInfo[3];
        tokenUri.toString().should.be.equal(_baseUri + _tokenURI);
      });
    });

    describe('burning the same token twice', async function () {

      beforeEach(async function () {
        await this.token.burn(tokenToBurn, {from: _curatorAccount});
      });

      it('reverts', async function () {
        await assertRevert(this.token.burn(tokenToBurn, {from: _curatorAccount}));
      });
    });

    describe('tokens already purchased', async function () {
      beforeEach(async function () {
        await this.token.purchaseWithEther(tokenToBurn, {
          value: _priceInWei,
          from: _buyer
        });
      });

      it('reverts when being burnt', async function () {
        await assertRevert(this.token.burn(tokenToBurn, {from: _curatorAccount}));
      });
    });

  });

  describe('resetting artist address', async function () {
    const _editionXXXDigital = 'XXX0000000000DIG';

    beforeEach(async function () {
      await this.token.mint(_tokenURI, _editionXXXDigital, _priceInWei, _purchaseFromTime, _curatorAccount, {from: _curatorAccount});
    });

    it('should adjust reference to new artist account', async function () {

      let editionInfo = await this.token.editionInfo(firstTokenId);
      let artistAcc = editionInfo[4];
      artistAcc.toString().should.be.equal(_curatorAccount);

      await this.token.setArtistAccount(_editionXXXDigital, _artist, {from: _curatorAccount});

      editionInfo = await this.token.editionInfo(firstTokenId);
      artistAcc = editionInfo[4];
      artistAcc.toString().should.be.equal(_artist);
    });
  });
});
