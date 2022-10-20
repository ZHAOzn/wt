// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportGetDate from '../../../app/utils/getDate';

declare module 'egg' {
  interface Application {
    utils: T_custom_utils;
  }

  interface T_custom_utils {
    getDate: AutoInstanceType<typeof ExportGetDate>;
  }
}
