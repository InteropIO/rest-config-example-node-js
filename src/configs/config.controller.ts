import { Controller, Headers, Get, Query, Post, Body } from '@nestjs/common';
import { FileBasedConfigService } from './config.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetConfigsRequestDto } from './dto/get-configs-request.dto';
import { GetConfigsResponseDto } from './dto/get-configs-response.dto';

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
    type: GetConfigsResponseDto
  })
  async get(@Body() config : GetConfigsRequestDto): Promise<Record<string, string>> {
     let configsParam: string = config.configs ?? "*";
     console.log("Getting configs");
     return this.service.get(configsParam);
  }  
}
