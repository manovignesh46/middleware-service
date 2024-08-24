import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatusMessageWrapper } from '../../decorators/status-message-wrapper.decorator';
import { ResponseMessage } from '../../domain/model/enum/responseMessage.enum';
import { ResponseStatusCode } from '../../domain/model/enum/responseStatusCode.enum';
import { LOSAuthGuard } from '../../guards/los-auth.guard';
import { NotificationService } from '../../usecases/notification.service';
import { StatusMessagePresenter } from './common/statusMessage.presenter';
import { SendLOSNotificationDto } from './dto/send-los-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { LOSSendNotificationPresenter } from './presenters/los-send-notification.presenter';
import { PushStatusDTO } from './dto/pushStatus.dto';

@Controller('v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiTags('Internal Endpoints')
  @ApiBody({ type: SendNotificationDto })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    await this.notificationService.sendNotification(sendNotificationDto);
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.SUCCESS;
    return new StatusMessagePresenter(status, message);
  }

  @Post('message/register')
  @UseGuards(LOSAuthGuard)
  @ApiTags('Internal LOS Endpoints')
  @ApiBody({ type: SendLOSNotificationDto })
  @ApiOkResponse({ type: LOSSendNotificationPresenter })
  async sendLOSNotification(
    @Body() sendLOSNotificationDto: SendLOSNotificationDto,
  ) {
    const { isSent, notificationUUID } =
      await this.notificationService.sendLOSNotification(
        sendLOSNotificationDto,
      );
    let status: number;
    if (isSent) {
      status = ResponseStatusCode.SUCCESS;
    } else {
      status = ResponseStatusCode.FAIL;
    }
    return {
      status,
      txn_id: sendLOSNotificationDto?.txn_id,
      notification_ref_number: notificationUUID,
    };
  }

  @Post('pushstatus')
  @ApiTags('Push Notification')
  @ApiBody({ type: PushStatusDTO })
  @ApiOkResponse({
    type: StatusMessageWrapper(
      null,
      ResponseStatusCode.SUCCESS,
      ResponseMessage.PUSH_STATUS_SUCCESS,
    ),
  })
  async pushStatus(@Body() pushStatusDTO: PushStatusDTO) {
    const result: boolean = await this.notificationService.pushStatus(
      pushStatusDTO,
    );
    if (result !== null) {
      if (result) {
        return new StatusMessagePresenter(
          ResponseStatusCode.SUCCESS,
          ResponseMessage.PUSH_STATUS_SUCCESS,
          null,
        );
      } else {
        return new StatusMessagePresenter(
          ResponseStatusCode.PUSH_STATUS_INVALID_STATUS,
          ResponseMessage.PUSH_STATUS_INVALID_STATUS,
          null,
        );
      }
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.PUSH_STATUS_NO_RECORD,
        ResponseMessage.PUSH_STATUS_NO_RECORD,
        null,
      );
    }
  }
}
