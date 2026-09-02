function Footer(){
    return(
        <footer id="lokasi" className="bg-[#F5FEFE] text-[#3a2c29] px-6 md:px-8 py-12 md:py-16 border-t-4 border-[#1C1410]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
                <div>
                    <h3 className="font-heading text-lg md:text-xl font-bold mb-4">
                        Cek Lokasi Mr. R
                    </h3>
                    <div className="bg-[#6b4832] h-40 rounded mb-4"></div>
                    <div className="border-2 border-[#1c1410]">
                        <div className="p-3 text-center font-semibold text-xs md:text-sm">
                            Mr. R Coffee - JAKARTA
                        </div>
                        <div className="bg-[#1c1410] text-[#f5fefe] p-2 text-center text-xs">
                            Petunjuk Arah
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 tracking-wide text-sm md:text-base">Info Mr. R</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/#tentang" className="hover:text-[#6b4832] cursor-pointer">Tentang Kami</a></li>
                        <li><a href="/#menu" className="hover:text-[#6b4832] cursor-pointer">Menu</a></li>
                        <li><a href="/#lokasi" className="hover:text-[#6b4832] cursor-pointer">Lokasi Toko</a></li>
                        <li><a href="/galery" className="hover:text-[#6b4832] cursor-pointer">Gallery</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 tracking-wide text-sm md:text-base">JAM BUKA</h3>
                    <div className="space-y-2 text-sm">
                        <p>Senin - Jumat</p>
                        <p className="text-[#8a7a6d]">12:00 - 00:00</p>
                        <p className="pt-2">Sabtu - Minggu</p>
                        <p className="text-[#8a7a6d]">08:00 - 23:00</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 tracking-wide text-sm md:text-base">HUBUNGI KAMI</h3>
                    <div className="border-2 border-[#1c1410] mb-4">
                        <div className="p-3 text-center font-semibold text-xs md:text-sm">
                            +62 813 1738 1863
                        </div>
                        <div className="bg-[#1c1410] text-[#f5fefe] p-2 text-center text-xs">
                            INFORMASI DAN PEMESANAN
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1c1410]"></div>
                        <div className="w-10 h-10 rounded-full bg-[#1c1410]"></div>
                        <div className="w-10 h-10 rounded-full bg-[#1c1410]"></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-xs tracking-wide pt-6 md:pt-8 border-t border-[#d4c9ae] text-center">
                <a href="#" className="hover:text-[#8a7a6d]">Syarat dan Ketentuan</a>
                <a href="#" className="hover:text-[#8a7a6d]">Kebijakan Privasi</a>
                <span>© 2026 MR. R COFFEE</span>
            </div>
        </footer>
    )
}

export default Footer