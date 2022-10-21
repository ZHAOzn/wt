// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDev from '../../../app/controller/dev';
import ExportHome from '../../../app/controller/home';
import ExportRecordCheck from '../../../app/controller/record_check';
import ExportTech from '../../../app/controller/tech';

declare module 'egg' {
  interface IController {
    dev: ExportDev;
    home: ExportHome;
    recordCheck: ExportRecordCheck;
    tech: ExportTech;
  }
}
