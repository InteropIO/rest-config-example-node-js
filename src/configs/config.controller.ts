import { Controller, Headers, Get, Query, Post, Body } from '@nestjs/common';
import { FileBasedConfigService } from './config.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetConfigsRequestDto } from './dto/get-configs-request.dto';
import { GetConfigsResponsetDto } from './dto/get-configs-response.dto';

@ApiTags('Configurations')
@Controller("configs")
export class ConfigController {
  constructor(private readonly service: FileBasedConfigService) { }

  @Post()
  @ApiOperation({
    summary: "Retrieve configuration objects"
  })
  @ApiOkResponse({
    description: 'Successfully retrieved configurations.',
    type: GetConfigsResponsetDto
  })
  async get(@Body() config: GetConfigsRequestDto): Promise<Record<string, string>> {
     // get configs param from header OR from query OR default to "*"
     let configsParam: string = config.configs ?? "*";
     console.log("Getting configs", configsParam);
     return this.service.get(configsParam);
  }  
}
