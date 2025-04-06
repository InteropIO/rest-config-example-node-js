import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FileBasedPrefsService } from './prefs.service';
import { GetAppPrefsRequestDto } from './dto/get-request.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddPrefsRequestDto } from './dto/add-request.dto';
import { RemoveAppPrefsRequestDto } from './dto/remove-request.dto';
import { AppPreferencesDto } from './dto/prefs.dto';

@ApiTags('Preferences')
@Controller("prefs")
export class PrefsController {
  constructor(private readonly service: FileBasedPrefsService) { }

  @Get()
  @ApiOperation({
    summary: "Retrieve all preferences for a given app"
  })
  @ApiOkResponse({
    description: 'Successfully retrieved app preferences.', 
    type: AppPreferencesDto
  })
  async get(@Body() settings: GetAppPrefsRequestDto): Promise<AppPreferencesDto> {
    return this.service.get(settings.app);
  }

  @Get("all")
  @ApiOperation({
    summary: "Retrieve all preferences for all applications"
  })
  @ApiOkResponse({
    description: 'Successfully retrieved app preferences.', 
    type: [AppPreferencesDto]
  })
  async getAll(): Promise<AppPreferencesDto[]> {
    const pref = await this.service.getAll();
    return pref;
  }

  @Post()
  @ApiOperation({
    summary: "Add or update preferences for an application"
  })
  save(@Body() prefs: AddPrefsRequestDto): Promise<void> {
    console.log("Saving prefs", prefs);
    return this.service.add(prefs.app, prefs.data);
  }

  @Delete()
  @ApiOperation({
    summary: "Removes preferences for an application"
  })
  removeApp(@Body() removeRequest: RemoveAppPrefsRequestDto): Promise<void> {
    console.log("Removing prefs", removeRequest);
    if (!removeRequest.app) {
      return this.service.remove(removeRequest.app);
    } else {
      return this.service.clear();
    }
  }
}
