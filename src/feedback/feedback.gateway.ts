import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/shared/filters/ws-filters/AllExceptionFilter.filter';
import { Server, Socket } from 'socket.io';
import { Roles } from 'src/shared/decorators/role.decorator';
import { JwtService } from '@nestjs/jwt';
import { FindFeedbackDto } from './dto/find-feedback.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';

@WebSocketGateway()
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe({ whitelist: true }))
export class FeedbackGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly feedbackService: FeedbackService,
    private jwtService: JwtService,
  ) {}

  @Roles('coach')
  @UseGuards(RoleGuard)
  @SubscribeMessage('createFeedback')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createFeedbackDto: CreateFeedbackDto,
  ) {
    this.server
      .to(['coach', 'admin'])
      .emit(
        'createNewFeedback',
        await this.feedbackService.create(
          (
            this.jwtService.verify(
              client.handshake.headers.authorization.split(' ')[1],
            ) as { userId: string }
          ).userId,
          createFeedbackDto,
        ),
      );
  }

  @Roles('admin', 'coach')
  @UseGuards(RoleGuard)
  @SubscribeMessage('findAllFeedback')
  async findAll(@ConnectedSocket() client: Socket) {
    client.emit('response', await this.feedbackService.findAll());
  }

  @SubscribeMessage('findOneFeedback')
  async findOne(
    @ConnectedSocket() client: Socket,
    @MessageBody() findFeedbackDto: FindFeedbackDto,
  ) {
    client.emit(
      'response',
      await this.feedbackService.findOne(
        (
          this.jwtService.verify(
            client.handshake.headers.authorization.split(' ')[1],
          ) as { userId: string }
        ).userId,
        findFeedbackDto.id,
      ),
    );
  }

  @Roles('coach')
  @UseGuards(RoleGuard)
  @SubscribeMessage('updateFeedback')
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    this.server
      .to(['coach', 'admin'])
      .emit(
        'updateExistsFeedback',
        await this.feedbackService.update(
          (
            this.jwtService.verify(
              client.handshake.headers.authorization.split(' ')[1],
            ) as { userId: string }
          ).userId,
          updateFeedbackDto,
        ),
      );
  }

  @Roles('admin')
  @SubscribeMessage('removeFeedback')
  async remove(@MessageBody() findFeedbackDto: FindFeedbackDto) {
    this.server
      .to(['admin', 'coach'])
      .emit(
        'removeExistsFeedback',
        await this.feedbackService.remove(findFeedbackDto.id),
      );
  }
}
