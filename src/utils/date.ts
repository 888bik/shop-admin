import dayjs from "dayjs";

export type Timestamp = number | string | null | undefined;
/**
 * 将时间戳或日期字符串格式化为指定格式
 * @param date 时间戳（毫秒）或日期字符串
 * @param formatStr 输出格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的字符串，如果传入无效返回 '-'
 */
export function formatDate(
  date: number | string | undefined | null,
  formatStr = "YYYY-MM-DD HH:mm:ss"
): string {
  if (!date) return "-";
  return dayjs(date).format(formatStr);
}

export const timeUtils = {
  /**
   * 格式化时间戳
   * @param ts 时间戳（秒或毫秒）
   * @param format 格式化字符串，默认 'YYYY-MM-DD HH:mm:ss'
   * @param isSeconds 是否是秒级时间戳，默认 true
   * @returns 格式化后的字符串，ts 无效时返回 '-'
   */
  format(
    ts: Timestamp,
    format: string = "YYYY-MM-DD HH:mm:ss",
    isSeconds: boolean = true
  ): string {
    if (!ts) return "-";
    const time = isSeconds ? dayjs.unix(Number(ts)) : dayjs(Number(ts));
    return time.format(format);
  },

  /**
   * 获取当前时间戳
   * @param isSeconds 是否返回秒级，默认 true
   */
  now(isSeconds: boolean = true): number {
    return isSeconds ? Math.floor(Date.now() / 1000) : Date.now();
  },

  /**
   * 秒级时间戳转毫秒
   */
  toMillis(ts: number): number {
    return ts * 1000;
  },

  /**
   * 毫秒时间戳转秒
   */
  toSeconds(ts: number): number {
    return Math.floor(ts / 1000);
  },

  // 转为秒级时间戳
  toUnix(timestampOrDate: string | number | Date) {
    const t = dayjs(timestampOrDate);
    return t.unix(); // 返回秒级
  },
};
