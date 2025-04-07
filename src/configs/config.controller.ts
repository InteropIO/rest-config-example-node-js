import { Body, Controller, Headers, Get, Param, Post, Query } from '@nestjs/common';
import { FileBasedConfigService } from './config.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Configurations')
@Controller("configs")
export class ConfigController {
  constructor(private readonly service: FileBasedConfigService) { }

  @Get()
  @ApiOperation({
    summary: "Retrieve configuration objects"
  })
  @ApiOkResponse({
    description: 'Successfully retrieved app preferences.'
  })
  async get(@Headers('configs') configsHeader: string, @Query('search') configsQuery: string): Promise<any> {
     // get configs param from header OR from query OR default to "*"
     let configsParam: string = configsHeader ?? configsQuery ?? "*";
     console.log("Getting configs", configsParam);
     return this.service.get(configsParam);
  }  
}
