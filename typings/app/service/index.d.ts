// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportDev from '../../../app/service/Dev';
import ExportRecordCheck from '../../../app/service/Record_check';
import ExportTest from '../../../app/service/Test';
import ExportUtils from '../../../app/service/Utils';

declare module 'egg' {
  interface IService {
    dev: AutoInstanceType<typeof ExportDev>;
    recordCheck: AutoInstanceType<typeof ExportRecordCheck>;
    test: AutoInstanceType<typeof ExportTest>;
    utils: AutoInstanceType<typeof ExportUtils>;
  }
}
