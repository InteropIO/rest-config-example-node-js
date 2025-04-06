import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FileBasedPrefsService } from './prefs.service';
import { GetPrefsRequest } from './dto/get-request';
import { ApiTags } from '@nestjs/swagger';
import { AddPrefsRequest } from './dto/add-request.dto';
import { RemovePrefsRequest } from './dto/remove-request.dto';

@ApiTags('Preferences')
@Controller("prefs")
export class PrefsController {
  constructor(private readonly service: FileBasedPrefsService) { }

  @Get()
  async get(@Body() settings: GetPrefsRequest): Promise<Record<string, any>> {
    const pref = await this.service.get(settings.app);
    return pref;
  }

  @Get("all")
  async getAll(): Promise<Record<string, any>[]> {
    const pref = await this.service.getAll();
    return pref;
  }

  @Post()
  save(@Body() prefs: AddPrefsRequest): Promise<void> {
    console.log("Saving prefs", prefs);
    return this.service.add(prefs.app, prefs.data);
  }

  @Delete()
  removeApp(@Body() removeRequest: RemovePrefsRequest): Promise<void> {
    console.log("Removing prefs", removeRequest);
    if (!removeRequest.app) {
      return this.service.remove(removeRequest.app);
    } else {
      return this.service.clear();
    }
  }
}
