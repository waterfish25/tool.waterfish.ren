const tools = [
  { name: "图片格式转换", description: "PNG、JPEG、WebP 等格式互转，支持批量处理。", url: "https://tool.waterfish.ren/Image/ImageConvert" },
  { name: "图片压缩", description: "调整质量重新编码，减小图片体积。", url: "https://tool.waterfish.ren/Image/ImageCompress" },
  { name: "图片尺寸调整", description: "按指定宽高缩放，可锁定宽高比。", url: "https://tool.waterfish.ren/Image/ImageResize" },
  { name: "图片 Base64", description: "图片与 Base64 编码互转，支持 Data URI。", url: "https://tool.waterfish.ren/Image/ImageBase64" },
  { name: "图片旋转翻转", description: "旋转 90°、180°、270°，支持水平与垂直翻转。", url: "https://tool.waterfish.ren/Image/ImageRotate" },
  { name: "图片水印", description: "批量添加文字水印，可调位置、大小与透明度。", url: "https://tool.waterfish.ren/Image/ImageWatermark" },
  { name: "JSON 格式化", description: "格式化、压缩与校验 JSON，支持自定义缩进。", url: "https://tool.waterfish.ren/JSON/JSONFormat" },
  { name: "时间戳转换", description: "Unix 时间戳与北京时间、UTC、ISO 双向转换。", url: "https://tool.waterfish.ren/Dev/TimeConvert" },
  { name: "颜色转换", description: "HEX、RGB、HSL 转换与实时预览。", url: "https://tool.waterfish.ren/Dev/ColorConvert" },
  { name: "密码生成", description: "自定义长度与字符集，本地生成高强度密码。", url: "https://tool.waterfish.ren/Dev/PasswordGenerator" },
  { name: "URL 编解码", description: "URL 编码与解码，处理中文与特殊字符。", url: "https://tool.waterfish.ren/Dev/UrlCodec" },
  { name: "Base64 编解码", description: "文本与 Base64 互转，支持中文与 Emoji。", url: "https://tool.waterfish.ren/Dev/TextBase64" },
  { name: "哈希计算", description: "生成 SHA-1、SHA-256、SHA-384、SHA-512 摘要。", url: "https://tool.waterfish.ren/Dev/HashGenerator" },
  { name: "UUID 生成", description: "批量生成 UUID v4，可切换大小写。", url: "https://tool.waterfish.ren/Dev/UuidGenerator" },
  { name: "文本统计", description: "统计字符、汉字、单词、行数与字节数。", url: "https://tool.waterfish.ren/Dev/TextCounter" }
];

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).json({ tools });
};
