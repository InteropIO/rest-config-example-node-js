import { Module } from '@nestjs/common';
import { AppsController } from './apps/apps.controller';
import { FileBasedAppsService } from './apps/apps.service';
import { LayoutsController } from './layouts/layouts.controller';
import { FileBasedLayoutsService } from './layouts/layouts.service';
import { FileBasedPrefsService } from './prefs/prefs.service';
import { PrefsController } from './prefs/prefs.controller';
import { ConfigController } from './configs/config.controller';
import { FileBasedConfigService } from './configs/config.service';

@Module({
  imports: [],
  controllers: [ AppsController, LayoutsController, PrefsController, ConfigController],
  providers: [ FileBasedAppsService, FileBasedLayoutsService, FileBasedPrefsService, FileBasedConfigService],
})
export class AppModule {}
