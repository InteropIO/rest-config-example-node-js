import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FileBasedAppsService } from './apps.service';
import { GetAppsResponseDto } from './dto/get-apps-response.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationDto } from './dto/app.dto';

@Controller("apps")
@ApiTags("Applications")
export class AppsController {
  constructor(private readonly appService: FileBasedAppsService) { }

  @Get()
  @ApiOperation({
    summary: "Retrieve all application definitions",
    description: "The definition of an app is a JSON file which allows the app to be accessible to the user from the io.Connect launcher. For more information see https://docs.interop.io/desktop/developers/configuration/application/index.html"  
  })
  @ApiOkResponse({
    description: 'Successfully retrieved applications.', 
    type: GetAppsResponseDto
  })
  async getApps(): Promise<GetAppsResponseDto> {
    const applications = await this.appService.getApps();
    return {
      applications
    };
  }

  @Post()
  @ApiOperation({
    summary: "Add or update an application definition",
    description: "The definition of an app is a JSON file which allows the app to be accessible to the user from the io.Connect launcher. For more information see https://docs.interop.io/desktop/developers/configuration/application/index.html"  
  })
  addApp(@Body() def: ApplicationDto): Promise<void> {
    return this.appService.addApp(def);
  }

  @Delete(":name")
  @ApiOperation({
    summary: "Remove an application definition",
    description: "The definition of an app is a JSON file which allows the app to be accessible to the user from the io.Connect launcher. For more information see https://docs.interop.io/desktop/developers/configuration/application/index.html"  
  })
  removeApp(@Param("name") name: string): Promise<void> {
    return this.appService.removeApp(name);
  }
}
