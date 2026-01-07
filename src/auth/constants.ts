// JWT 常量配置（类型必须正确）
export const jwtConstants = {
  secret: 'nest_auth_secret_123456', // 生产环境替换为复杂随机字符串
  expiresIn: 86400, // 字符串类型（支持 '1h'/'24h'/'7d' 等，或数字 86400 表示秒）
};
