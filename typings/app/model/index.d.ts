// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDev from '../../../app/model/dev';
import ExportDevEn from '../../../app/model/dev_en';
import ExportDevZh from '../../../app/model/dev_zh';
import ExportRecordCheck from '../../../app/model/record_check';

declare module 'egg' {
  interface IModel {
    Dev: ReturnType<typeof ExportDev>;
    DevEn: ReturnType<typeof ExportDevEn>;
    DevZh: ReturnType<typeof ExportDevZh>;
    RecordCheck: ReturnType<typeof ExportRecordCheck>;
  }
}
