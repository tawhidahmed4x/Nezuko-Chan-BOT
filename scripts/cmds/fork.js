module.exports = {
        config: {
                name: "fork",
                version: "1.7",
                author: "TawHid_Bbz",
                countDown: 5,
                role: 0,
                description: {
                        bn: "কি ভেবেছো? বটের টিউটোরিয়াল দিবো? কখনোই না, মারা খাও বেবী",
                        en: "ki Vabso! Bot er Tutorial Dibo? Kokkhonoi na. Mara Khau Baby",
                        vi: "Lấy liên kết fork GitHub và video hướng dẫn"
                },
                category: "facebook",
                guide: {
                        bn: '   {pn}: কন্টাক্ট করতে',
                        en: '   {pn}: For Contact',
                        vi: '   {pn}: Lấy liên kết fork'
                }
        },
onStart: async function ({ api, message, event }) {
    const facebooklink = "https://www.facebook.com/suhan420rx";
    const facebook2link = "https://www.facebook.com/tawhid.ahmed420";

    const response = `✨ | Get In Touch On Facebook:\n\n` +
                     `🔗 ${facebooklink}\n\n` +
                     `🔹 Another Account:\n` +
                     `🔗 ${facebook2link}`;

    return api.sendMessage(response, event.threadID, event.messageID);
  }
};
