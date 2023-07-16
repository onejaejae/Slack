import { Controller } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';

@Controller('workplaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
}
