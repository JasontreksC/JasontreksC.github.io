function encodePlantUML(plantumlCode) {
    // 1. 텍스트를 UTF-8 바이트 배열로 변환
    const utf8 = new TextEncoder().encode(plantumlCode);
    
    // 2. pako.js를 사용하여 DEFLATE 압축
    // (pako.deflate는 Uint8Array를 반환합니다)
    const compressed = pako.deflate(utf8, { level: 9 });

    // 3. 압축된 바이트 배열을 PlantUML 특수 Base64로 변환
    let encoded = '';
    const map = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

    for (let i = 0; i < compressed.length; i += 3) {
        const b1 = compressed[i];
        const b2 = compressed[i + 1];
        const b3 = compressed[i + 2];

        // 3 바이트를 4개의 6비트 그룹으로 나눕니다.
        const group1 = b1 >> 2;
        const group2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        const group3 = ((b2 & 0xF) << 2) | (b3 >> 6);
        const group4 = b3 & 0x3F;

        encoded += map[group1];
        encoded += map[group2];
        encoded += map[group3];
        encoded += map[group4];
    }
    
    // 패딩 문자 '=' 처리: PlantUML Base64는 패딩을 사용하지 않고 잘라냅니다.
    // 3바이트로 나누어 떨어지지 않는 경우 마지막 문자를 제거합니다.
    if (compressed.length % 3 === 2) {
        encoded = encoded.slice(0, encoded.length - 1);
    } else if (compressed.length % 3 === 1) {
        encoded = encoded.slice(0, encoded.length - 2);
    }

    return encoded;
}