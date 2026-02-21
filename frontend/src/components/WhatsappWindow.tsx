import React from 'react';

interface WhatsappWindowProps {
    userMessage?: string;
    botMessage?: string;
}

export function WhatsappWindow({ userMessage, botMessage }: WhatsappWindowProps) {
    return (
        <div className="w-full max-w-sm mx-auto bg-[#efeae2] dark:bg-[#0b141a] rounded-4xl shadow-2xl overflow-hidden border-8 border-zinc-800 dark:border-zinc-900 relative">
            {/* Phone Top Bar Mockup */}
            <div className="bg-[#005c4b] dark:bg-[#202c33] text-white px-4 py-3 flex items-center space-x-3 shadow-sm z-10 relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight truncate">Asistente Virtual</h3>
                    <p className="text-xs text-white/80 truncate">Cuenta de empresa</p>
                </div>
                <div className="flex items-center space-x-4">
                    <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 h-[500px] overflow-y-auto flex flex-col space-y-4 bg-[url('https://static.whatsapp.net/rsrc.php/v3/yl/r/rro_h1t1eMh.png')] bg-repeat bg-center">
                {/* User Message */}
                {userMessage && (
                    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] max-w-[85%] rounded-lg rounded-tr-none px-3 py-2 shadow-sm relative group">
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-ws">{userMessage}</p>
                            <div className="flex items-center justify-end space-x-1 mt-1 opacity-60">
                                <span className="text-[11px]">10:42 AM</span>
                                <svg className="w-[14px] h-[14px] text-[#53bdeb] dark:text-[#53bdeb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bot Message */}
                {botMessage && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                        <div className="bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] max-w-[85%] rounded-lg rounded-tl-none px-3 py-2 shadow-sm relative group">
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-ws">{botMessage}</p>
                            <div className="flex items-center justify-end space-x-1 mt-1 opacity-60">
                                <span className="text-[11px]">10:42 AM</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Phone Bottom Bar Mockup (Input Area) */}
            <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-3 py-2 flex items-center space-x-2 absolute bottom-0 w-full z-10">
                <div className="w-8 h-8 flex items-center justify-center text-zinc-500 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-full px-4 py-2 flex items-center">
                    <span className="text-[#8696a0] text-sm">Escribe un mensaje</span>
                </div>
                <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white cursor-pointer shadow-md">
                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </div>
            </div>
            {/* Notch / Dynamic Island Mock */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 dark:bg-zinc-900 rounded-b-3xl z-20 flex justify-center items-end pb-1">
                <div className="w-12 h-1 bg-zinc-700/50 rounded-full"></div>
            </div>
        </div>
    );
}
