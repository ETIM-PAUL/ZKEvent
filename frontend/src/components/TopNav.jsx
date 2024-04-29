import React from 'react'
import { shortenAddress } from '../utils'
import { Link } from 'react-router-dom'
import { useAccount, useBalance } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Logo from "./Logo";

const TopNav = () => {
  const { address, isConnected } = useAccount()
  const { open, close } = useWeb3Modal()
  const result = useBalance({
    address: address,
  })
  return (
    <div className="navbar flex bg-gradient-to-r from-[#5522CC] to-[#ED4690] py-8 px-6">
      <div className="flex-1 ml-16 ">
        <Logo />
      </div>

      <div className="flex mr-14 gap-10">
        <Link
          to="/user-dashboard"
          className="font-medium rounded-md text-xl px-4 py-3 text-center bg-white text-black"
        >
          Dashboard
        </Link>
        {isConnected ?
          <button onClick={() => open({ "view": 'Account' })} type="button" class={`py-2 rounded-md border border-bg-[#EEE1FF] w-fit px-3 items-center text-center flex  justify-center font-medium text-lg bg-gradient-to-r from-[#5522CC] to-[#ED4690] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"`}>
            {shortenAddress(address)} ~ {Number(result?.data?.formatted).toFixed(6) ?? ""}
          </button>
          :
          <button onClick={() => open()} type="button" class={`py-2 rounded-md border border-bg-[#EEE1FF] w-fit px-3 items-center text-center flex  justify-center font-medium text-lg bg-gradient-to-r from-[#5522CC] to-[#ED4690] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"`}>
            Connect Wallet
          </button>
        }
      </div>
    </div>
  )
}

export default TopNav