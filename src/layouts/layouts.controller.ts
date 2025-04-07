import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FileBasedLayoutsService } from './layouts.service';
import { GetLayoutsResponseDto } from './dto/get-layouts-response.dto';
import { DeleteLayoutRequestDto } from './dto/delete-layout-request.dto';
import { SaveLayoutRequestDto } from './dto/save-layout-request.dto';
import { LayoutDto } from './dto/layout.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller("layouts")
export class LayoutsController {
  constructor(private readonly service: FileBasedLayoutsService) {}

  @Get()
  @ApiOperation({
    summary: "Retrieve all layouts defined in the system"
  })
  @ApiOkResponse({
    description: 'Successfully retrieved layouts.', 
    type: GetLayoutsResponseDto
  })
  async getLayouts(): Promise<GetLayoutsResponseDto> {
    const layouts = await this.service.getAll();
    return {
      layouts
    };
  }

  @Post()
  @ApiOperation({
    summary: "Add or update a layout"
  })
  saveLayout(@Body() layout: SaveLayoutRequestDto): Promise<void> {
    console.log("Saving layout", layout);
    return this.service.saveLayout(layout.layout);
  }

  @Delete()
  @ApiOperation({
    summary: "Remove a layout"
  })
  removeApp(@Body() layout: DeleteLayoutRequestDto): Promise<void> {
    console.log("Removing layout", layout);
    return this.service.remove(layout.name, layout.type);
  }

  @Get("default")
  @ApiOperation({
    summary: "Retrieves the default global layout",
    description: "A default Global Layout is an already saved arrangement of interop-enabled apps that is restored upon startup of io.Connect Desktop. For more information - https://docs.interop.io/desktop/capabilities/windows/layouts/overview/index.html#default_global_layout"
  })
  @ApiOkResponse({
    description: 'Successfully retrieved layouts.', 
    type: GetLayoutsResponseDto
  })
  getDefaultLayout(): Promise<LayoutDto | undefined> {
    console.log("Getting default layout");
    return this.service.getDefaultLayout();
  }

  @Post("default")
  @ApiOperation({
    summary: "Sets the default global layout",
    description: "A default Global Layout is an already saved arrangement of interop-enabled apps that is restored upon startup of io.Connect Desktop. For more information - https://docs.interop.io/desktop/capabilities/windows/layouts/overview/index.html#default_global_layout"
  })
  saveDefaultLayout(@Body() layout: SaveLayoutRequestDto): Promise<void> {
    console.log("Saving default layout", layout);
    return this.service.saveDefaultLayout(layout);
  }
}
