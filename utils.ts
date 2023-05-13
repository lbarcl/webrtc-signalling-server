export function randomIDGen(length: number): string {
    const chars = "1234567890QWERTUIOPASDFGHJKLZXCVBNMqwertyuopasdfghjklzxcvbnm"
    let str = ""
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str;
}