import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from "axios";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Referer": "https://www.designkit.cn/quality",
  "Origin": "https://www.designkit.cn"
};

async function enhance(imageInput) {
  if (!imageInput) throw new Error("Input gambar wajib diisi (URL atau path file lokal).");

  let buf = null;
  if (typeof imageInput === "string" && imageInput.startsWith("http")) {
    const res = await axios.get(imageInput, { responseType: "arraybuffer", timeout: 25000 });
    buf = Buffer.from(res.data);
  }
  if (!buf && typeof imageInput === "string" && fs.existsSync(imageInput)) {
    buf = fs.readFileSync(imageInput);
  }
  if (!buf && Buffer.isBuffer(imageInput)) {
    buf = imageInput;
  }
  if (!buf) {
    throw new Error("Gagal membaca file/URL gambar.");
  }

  const policyRes = await axios.get("https://strategy.app.meitudata.com/upload/policy?app=xiuxiu-pro&count=1&suffix=jpeg&type=ai_quality", {
    headers: HEADERS,
    timeout: 15000
  });

  const qiniu = policyRes.data?.[0]?.qiniu;
  if (!qiniu?.token) throw new Error("Gagal mendapatkan token upload.");

  const form = new FormData();
  form.append("token", qiniu.token);
  if (qiniu.key) form.append("key", qiniu.key);
  form.append("file", new Blob([buf], { type: "image/jpeg" }), "image.jpg");

  const upRes = await fetch("https://up-qagw.meitudata.com/", { method: "POST", body: form });
  const upData = await upRes.json();
  const cloudUrl = upData?.data;
  if (!cloudUrl) throw new Error("Gagal upload gambar ke cloud Meitu.");

  const gid = "1a08f8" + crypto.randomBytes(6).toString("hex");
  const taskRes = await axios.post(`https://webapi.designkit.cn/v3/mtlab/image_restoration_async?gid=${gid}`, {
    parameter: {
      rsp_media_type: "url",
      custom_size_flag: 1,
      create_value: 100,
      hdr_value: 0,
      resemblance_value: 80,
      save_photo_format: 1
    },
    media_info_list: [{ media_data: cloudUrl, media_extra: {}, media_profiles: { media_data_type: "url" } }],
    extra: {}
  }, {
    headers: { ...HEADERS, "Content-Type": "application/json" },
    timeout: 15000
  });

  const msgId = taskRes.data?.data?.msg_id || taskRes.data?.msg_id;
  if (!msgId) throw new Error("Gagal membuat tugas AI.");

  let resultInfo = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1200));
    const qRes = await axios.get(`https://webapi.designkit.cn/v1/mtlab/query_multi?msg_ids=${msgId}`, {
      headers: HEADERS,
      timeout: 15000
    });
    const media = qRes.data?.data?.[0]?.media_info_list?.[0];
    if (media?.media_data) {
      resultInfo = media;
      break;
    }
  }

  if (!resultInfo?.media_data) {
    throw new Error("Proses AI timeout.");
  }

  return {
    status: true,
    url: resultInfo.media_data,
    width: resultInfo.media_profiles?.media_data_width || null,
    height: resultInfo.media_profiles?.media_data_height || null,
    size_bytes: resultInfo.media_profiles?.media_data_size || null
  };
}

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "enhance",
    alias: ["wink", "aienhance", "meitu"],
    desc: "Enhance image using Wink AI via FATIMA-MD",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        
        if (!mime || !mime.startsWith('image/')) {
            return await reply('❌ Please reply to an image to enhance it with Wink AI!');
        }

        await reply('🚀 Processing AI Image Enhancement (Wink/Meitu), please wait...');

        const mediaBuffer = await quoted.download();
        const result = await enhance(mediaBuffer);

        await conn.relayMessage(
            from,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    botMetadata: {
                        messageDisclaimerText: "",
                        botResponseId: "fatima-md-enhance-01",
                        verificationMetadata: {
                            proofs: [
                                {
                                    version: 1,
                                    useCase: 1,
                                    signature: SIG,
                                    certificateChain: [CERT1, CERT2]
                                }
                            ]
                        }
                    }
                },
                imageMessage: {
                    url: result.url,
                    mimetype: 'image/jpeg',
                    caption: `✨ *Wink AI Image Enhanced Successfully!*\n\n📏 *Resolution:* ${result.width || 'N/A'}x${result.height || 'N/A'}\n📦 *Size:* ${result.size_bytes ? (result.size_bytes / 1024).toFixed(2) + ' KB' : 'N/A'}\n👑 *Powered by:* FATIMA-MD`,
                    jpegThumbnail: mediaBuffer.toString('base64')
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('[ENHANCE ERROR]', e?.message || e);
        return await reply('❌ Failed to enhance image: ' + (e?.message || e));
    }
});
