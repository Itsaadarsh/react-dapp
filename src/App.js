import { ethers } from 'ethers';
import { useState } from 'react';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import './App.css';

const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

function App() {
  const [greeting, setGreetingValue] = useState('')

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        setGreetingValue(data)
        console.log("data: ", data);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  return (
    <div className="App">
      <header className='App-header'>
        <button onClick={fetchGreeting}>Fetch Greetings</button>
        <button onClick={setGreeting}>Set Greetings</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set Greeting" />
        {!greeting ?
          <p>------- fetching from blockchain -------</p> :
          <p>Output from blockchain : {greeting}</p>
        }
      </header>
    </div>
  );
}

export default App;
