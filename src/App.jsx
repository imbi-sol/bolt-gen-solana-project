import { useState } from 'react'
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair, 
  LAMPORTS_PER_SOL, 
  sendAndConfirmTransaction 
} from '@solana/web3.js'

function App() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const transferSOL = async () => {
    setIsLoading(true)
    setStatus('')
    setError('')

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
      const fromWallet = Keypair.generate()
      const toWalletAddress = new PublicKey('GcSoPa7phzocVtZYy7NrWJVxnnbo6p8KTrztghKusNQr')

      setStatus('Requesting airdrop...')
      const airdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL
      )
      await connection.confirmTransaction(airdropSignature)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: toWalletAddress,
          lamports: LAMPORTS_PER_SOL * 0.5
        })
      )

      setStatus('Processing transfer...')
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
      )

      setStatus(`
        Transfer complete!
        From: ${fromWallet.publicKey.toString()}
        To: ${toWalletAddress.toString()}
        Signature: ${signature}
      `)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Solana Transfer</h1>
      <button onClick={transferSOL} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Transfer 0.5 SOL'}
      </button>
      
      {status && (
        <pre className="status success">
          {status}
        </pre>
      )}
      
      {error && (
        <pre className="status error">
          Error: {error}
        </pre>
      )}
    </div>
  )
}

export default App
