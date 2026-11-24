"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {User2} from "lucide-react"

export default function Navbar(){

    return(
        <>
        <div className="max-w-350 mx-5 sm:mx-10 lg:mx-30 items-center flex justify-between m-1 bg-blue-200/50 rounded-2xl p-1">
            <div className="flex justify-between items-center">
                <div>
                    <img src="/oratoai-logo.png" alt="oratoai-logo"
                    className="w-12 h-12 lg:w-14 lg:h-14" />
                </div>
                <div className="mb-1">
                    <p className="text-xl font-bold lg:2xl text-blue-950">orato<span className="text-orange-500">ai</span></p>
                </div>
            </div>
            <div className="gap-4 flex text-sm font-semibold text-slate-700 items-center">
                <Link href={'/'} className="hover:text-blue-800">Progress</Link>
                <Link href={'/'} className="hover:text-blue-800">About Us</Link>
                <button className="w-8 h-8 rounded-full hover:bg-blue-200 focus:bg-blue-300 bg-gray-200 justify-center flex items-center">
                    <User2 size={22} className="bg-white rounded-full p-0.5 hover:text-blue-800"/>
                </button>
            </div>
        </div>
        </>
    )
}