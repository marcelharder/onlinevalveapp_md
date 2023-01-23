import { OnInit, Component } from '@angular/core';
import { EmailMessage } from 'src/app/_models/EmailMessage';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {
  newMessage: any = {};
  messages: EmailMessage[];
  mail: EmailMessage = {
    Id: 0,
    senderId: 0,
    senderKnownAs: '',
    senderPhotoUrl: '',
    recipientId: 0,
    recipientKnownAs: '',
    recipientPhotoUrl: '',
    content: '',
    isRead: false,
    dateRead: null,
    messageSent: null
  };
  pagination: Pagination;
  messageContainer = 'Unread';
  details = 0;
  list = 1;
  compose = 0;
  title = '';

  constructor(private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
    });
  }
  loadMessages(selector: number) {
    switch (selector) {
      case 1: this.messageContainer = 'Unread'; break;
      case 2: this.messageContainer = 'Inbox'; break;
      case 3: this.messageContainer = 'Outbox'; break;
    }
    this.userService.getMessages(this.authService.decodedToken.nameid,
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.messageContainer).subscribe((res: PaginatedResult<EmailMessage[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, (error) => { this.alertify.error(error); });
  }
  deleteMessage(id: number) {
    this.alertify.confirm('You are sure ?', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid)
        .subscribe(() => {
          this.messages.splice(this.messages.findIndex(m => m.Id === id), 1);
          this.alertify.success('Message has been deleted');
        },
          error => {
            this.alertify.error('Failed to delete the message');
          });
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages(4);
  }
  showMessageDetails(id: number) {
    // mark the message as read
    this.userService.markAsRead(+this.authService.decodedToken.nameid, id);
    // get the message details
    this.userService.getMessage(+this.authService.decodedToken.nameid, id).subscribe((next) => {
      this.mail = next;
    });
    this.details = 1;
    this.list = 0;
    this.compose = 0;
  }
  showDetails() { if (this.details === 1) { return true; } }
  showList() { if (this.list === 1) { return true; } }
  showCompose() { if (this.compose === 1) { return true; } }
  cancel() { this.list = 1; this.compose = 0; this.details = 0; }
  composeMessage() {
    this.mail.content = '';
    this.details = 0;
    this.list = 0;
    this.compose = 1;
  }
  replyMessage() {
    this.newMessage.recipientId = this.mail.senderId;
    this.newMessage.content = this.mail.content;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((message: EmailMessage) => {
      this.newMessage.content = '';
      this.cancel();
    }, error => {
      this.alertify.error(error);
    })
  }
}
