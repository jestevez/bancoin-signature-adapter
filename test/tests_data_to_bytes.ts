import { SeedAdapter, SIGN_TYPE } from '../src/index';
import { txs } from './transactionsData';
import { libs } from '@bancoin/bancoin-transactions';

const { verifySignature } = libs.crypto;

const TEST_SEED = 'some test seed words without money, you can try check balance';

const checkTx = (type: keyof typeof txs, version: number) => {
    const txData = (txs[type] as any)[version];
    const data = txData.data;
    return {
        name: `Test ${txData.name} v.${version} transaction.`,
        check: () => {
            const adapter = new SeedAdapter(TEST_SEED, txData.network);
            const signable = adapter.makeSignable({
                type,
                data:  { ...data, version } as any
            } as any);
            return Promise.all([adapter.getPublicKey(), signable.getBytes(), signable.getId(), signable.getSignData(), signable.getSignature()])
                .then(([pubk, bytes, id, signedData, signature]) => {
                    expect(checkCryptoGen(signedData.senderPublicKey)(bytes, txData.proof)).toBe(true);
                    expect(checkCryptoGen(pubk)(bytes, signature)).toBe(true);
                    expect(id).toEqual(txData.id);
                });
        }
    };
};

const checkCryptoGen = (publicKey: string) => (bytes: Uint8Array, signature: string) => verifySignature(publicKey, bytes, signature);


describe('Create data and signature check', () => {
    
    describe('Check transactions', () => {
    
        it('check issure signature', () => checkTx(SIGN_TYPE.ISSUE, 2).check());
        
        it('check reissure signature', () => checkTx(SIGN_TYPE.REISSUE, 2).check());
        
        it('check burn signature', () => checkTx(SIGN_TYPE.BURN, 2).check());
        
        it('check lease signature', () => checkTx(SIGN_TYPE.LEASE, 2).check());
        
        it('check cancel lease signature', () => checkTx(SIGN_TYPE.CANCEL_LEASING, 2).check());
        
        it('check create alias signature', () => checkTx(SIGN_TYPE.CREATE_ALIAS, 2).check());
        
        it('check transfer from node signature', () => checkTx(SIGN_TYPE.TRANSFER, 2).check());
    
        it('check mass transfer from node signature', () => checkTx(SIGN_TYPE.MASS_TRANSFER, 1).check());
        
        it('check exchange signature', () => checkTx(SIGN_TYPE.EXCHANGE, 0).check());
        
        it('check exchange v2 signature', () => checkTx(SIGN_TYPE.EXCHANGE, 2).check());
        
        it('check data signature', () => checkTx(SIGN_TYPE.DATA, 1).check());
        
        it('check sponsorship signature', () => checkTx(SIGN_TYPE.SPONSORSHIP, 1).check());
        
        it('check set script signature', () => checkTx(SIGN_TYPE.SET_SCRIPT, 1).check());
        
        it('check set asset script signature', () => checkTx(SIGN_TYPE.SET_ASSET_SCRIPT, 1).check());
        
        it('check script invocation signature', () => checkTx(SIGN_TYPE.SCRIPT_INVOCATION, 1).check());
        
        it('check auth signature', () => checkTx(SIGN_TYPE.AUTH, 1).check());
        
        it('check coinomat signature', () => checkTx(SIGN_TYPE.COINOMAT_CONFIRMATION, 1).check());
        
        it('check matcher orders signature', () => checkTx(SIGN_TYPE.MATCHER_ORDERS, 1).check());
    
        it('check matcher cancel order signature 0', () => checkTx(SIGN_TYPE.CANCEL_ORDER, 0).check());
        
        it('check matcher cancel order signature', () => checkTx(SIGN_TYPE.CANCEL_ORDER, 1).check());
        
        it('check matcher create order signature', () => checkTx(SIGN_TYPE.CREATE_ORDER, 1).check());
        
        it('check matcher create order 2 signature', () => checkTx(SIGN_TYPE.CREATE_ORDER, 2).check());
    });
});
