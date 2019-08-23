export enum DlStatus {
  /** 下载中 */
  Downloading = 1,
  /** 暂停 */
  Pause = 2,
  /** 下载完毕 */
  Done = 3,
  /** 已取消 */
  Cancelled = 4,
  /** 下载错误 */
  Fail = 5
}

export enum DlAction {
  /** 暂停 */
  Pause = 1,
  /** 恢复 */
  Resume = 2,
  /** 取消 */
  Cancel = 3,
  /** 重启 */
  Restart = 4
}
