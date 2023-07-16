import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { WsException } from '@nestjs/websockets';
import { v4 as uuid } from 'uuid';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Assignment) private Assignments: Repository<Assignment>,
    @InjectRepository(Feedback) private Feedbacks: Repository<Feedback>,
    @InjectRepository(User) private Users: Repository<User>,
  ) {}

  async create(userId: string, data: CreateFeedbackDto) {
    const assignment = await this.Assignments.findOne({
      where: { id: data.assignment },
      relations: ['reviews'],
      select: { reviews: { id: true } },
    });
    if (!assignment) throw new WsException('assignment not found');
    if (assignment.reviews.length < 2)
      throw new WsException('assignment reviews must be at least 2');
    const feedback = await this.Feedbacks.save({
      id: uuid(),
      ...(data as any),
      assignment,
      user: await this.Users.findOneBy({ id: userId }),
    });
    return await this.Feedbacks.findOne({
      where: { id: feedback.id },
      relations: ['user', 'assignment', 'assignment.task'],
      select: {
        user: { id: true, name: true },
        assignment: { id: true, task: { id: true, title: true } },
      },
    });
  }

  async findAll() {
    return await this.Feedbacks.find({
      relations: ['user', 'assignment', 'assignment.task'],
      select: {
        user: { id: true, name: true },
        assignment: { id: true, task: { id: true, title: true } },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const feedback = await this.Feedbacks.findOne({
      where: { id },
      relations: ['user', 'assignment', 'assignment.task', 'assignment.user'],
      select: {
        user: { id: true, name: true },
        assignment: {
          id: true,
          task: { id: true, title: true },
          user: { id: true },
        },
      },
    });
    const user = await this.Users.findOneBy({ id: userId });
    if (user.role === 'coach' || user.role === 'admin') return feedback;
    if (feedback.assignment.user.id !== userId)
      throw new WsException('not allowed');
    return feedback;
  }

  async update(userId: string, data: UpdateFeedbackDto) {
    const res = await this.Feedbacks.update(
      { id: data.id, user: { id: userId } },
      data,
    );
    if (res.affected < 1) throw new WsException('cannot update this feedback');
    return await this.Feedbacks.findOne({
      where: { id: data.id },
      relations: ['user', 'assignment', 'assignment.task'],
      select: {
        user: { id: true, name: true },
        assignment: { id: true, task: { id: true, title: true } },
      },
    });
  }

  async remove(id: string) {
    const res = await this.Feedbacks.delete({ id });

    if (res.affected < 1) throw new WsException('cannot remove this feedback');
    return id;
  }
}
