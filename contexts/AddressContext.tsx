import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/addressService';
import { Address } from '../services/addressService';

interface Ctx {
  addresses: Address[];
  loading: boolean;
  add: (addr: Address) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}
const AddressContext = createContext<Ctx | undefined>(undefined);

export const AddressProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [addresses,setAddresses]=useState<Address[]>([]);
  const [loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true);const list=await api.getAddresses();setAddresses(list);setLoading(false);};
  useEffect(()=>{load();},[]);
  const add=async(addr:Address)=>{if(addresses.length>=5) throw new Error('max');await api.addAddress(addr);await load();};
  const remove=async(id:string)=>{await api.deleteAddress(id);await load();};
  return <AddressContext.Provider value={{addresses,loading,add: add, remove, reload:load}}>{children}</AddressContext.Provider>;
};
export const useAddress=()=>{const c=useContext(AddressContext);if(!c)throw new Error('useAddress outside');return c}; 