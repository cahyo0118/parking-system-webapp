import { Environment } from './../../../../config/environment';
import { ActivatedRoute } from '@angular/router';
import { APIService } from './../../../../service/api.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/service/file-upload.service'

@Component({
  selector: 'app-community-single',
  templateUrl: './community-single.component.html',
  styleUrls: ['./community-single.component.css']
})
export class CommunitySingleComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  id: any;
  data: any;
  replyMessage: String;
  newMessage: String;
  isMoreReply: boolean = true;
  isMoreMessage: boolean = true;
  showThread: any;
  replyThread: Array<Object> = [];
  messageList: Array<Object> = [];
  eventList: Array<Object> = [];
  jobList: Array<Object> = [];
  memberList: Array<Object> = [];
  showLoader: boolean = false;
  view: String = 'chat';
  searchMemberKeys: String = '';
  menu = {
    name: 'community-list',
    display_name: 'Community',
    icon: 'fas fa-users'
  };
  threadForm: FormGroup;
  activeForm: String = '';
  memberOpen: Object = {};
  photoPreview: any;
  photoUploadProgress: Number = 0;
  imgOpen: String = ''
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
    public env: Environment,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
      this.id = params.id;
      this.getData();
      this.openMessage();
      this.loadEvent(true);
      this.loadJob(true);
      this.loadMember(true);
    }
  }

  getData() {
    this.apiService.get(
      `api/community/${this.id}/detail`,
      {
        params: {
          withCount: ['events','jobVacancies','members']
        }
      }
    ).then(
      response => {
        this.data = response.data.body;
      }
    );
  }

  openMessage(){
    this.view = 'message'
    this.getMessage(true);
  }
  getMessage(merge){
    this.apiService.get(
      `api/community/${this.id}/message`,
      {
        params: {
          limit: 10,
          offset: merge ? this.messageList.length : 0,
          orderBy: 'id',
          orderType: 'desc',
          with: ['user']
        }
      }
    ).then(
      response => {
        this.messageList = merge ? response.data.body.reverse().concat(this.messageList) : response.data.body.reverse()
        this.isMoreMessage = response.data.body.length == 10;
      }
    );
  }
  sendMessage(){
    const message = this.newMessage.trim()
    this.newMessage = ""
    if(message !== '') {
      this.apiService.post(
        `api/community/${this.id}/message/store`,
        {
          caption: message
        }
      ).then(response => { this.getMessage(false) });
    }
  }
  deleteMessage(e){
    Swal.fire({
      title: 'Delete this replies ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.apiService.delete(
          `api/community/${this.id}/message/${e}/delete`,
          null
        ).then(
          response => {
            this.getMessage(false)
          },
          error => {
            Swal.fire(
              'Error!',error.response.data.message,'error'
            );
          }
        );
      }
    });
  }

  detailThread(e,f){
    if(f != this.showThread?.id){
      this.replyThread = [];
      this.apiService.get(
        `api/thread/${f}/detail`,
        {
          params: {
            with: ['user']
          }
        }
      ).then(
        response => {
          this.view = 'thread'
          this.showThread = response.data.body
        }
      );
      this.getReplies(f, true)
    }
  }
  newThread(e,f){
    switch(e){
      case 'event':
        this.threadForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          photo: ['', []],
          caption: ['', [Validators.required]],
          start_date: ['', [Validators.required]],
          start_time: ['', [Validators.required]],
          finish_date: ['', [Validators.required]],
          finish_time: ['', [Validators.required]],
          googlePlaceId: [null, []],
          contentType: ['event',[]],
          privacy: ['community',[]],
          isAvailable: [true, []],
          communityId:[this.id,[]]
        });
        this.activeForm = 'Event'
      break;
      case 'jobVacancy': 
        this.threadForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          photo: ['', []],
          caption: ['', [Validators.required]],
          company_name: ['', [Validators.required]],
          monthly_salary_min: [0, [Validators.required]],
          monthly_salary_max: [0, [Validators.required]],
          googlePlaceId: [null, []],
          contentType: ['jobVacancy',[]],
          privacy: ['community',[]],
          isAvailable: [true, []],
          communityId:[this.id,[]]
        });
        this.activeForm = 'Job Vacancy'
      break;
    }
    this.modalService.open(f, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
  }
  storeThread(e){
    this.apiService.post(
      `api/thread/store`, this.threadForm.value
    ).then((res:any) => { 
        // console.log(res?.body?.data?.id)
        this.modalService.dismissAll()
        this.photoPreview = ""
        this.photoUploadProgress = 0
        if (e == 'Event') this.loadEvent(true)
        else this.loadJob(true)
    });
  }
  deleteThread(e,f){
    Swal.fire({
      title: 'Delete this data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.apiService.delete(
          `api/thread/${f}/delete`,
          null
        ).then(
          response => {
            Swal.fire('Success!',response.data.message,'success');
            if (e == 'event') this.loadEvent(false)
            else this.loadJob(false)
            this.openMessage()
          },
          error => {
            Swal.fire(
              'Error!',
              error.response.data.message,
              'error'
            );
          }
        );
      }
    });
  }
  updateAvailabilityThread(){
    this.showThread.isAvailable = this.showThread.isAvailable === 0 ? 1 : 0;
    this.apiService.put(
      `api/thread/${this.showThread?.id}/update-availability/${this.showThread.isAvailable}`,{}
    ).then(
      response => {
        console.log('success')
      }
    );
  }
  async onPhotoChange(event: any, formControlName) {
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      Swal.fire({
        title: 'Oops!',
        text: 'Only images are supported',
        icon: 'error',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (eventReader: any) => {
      switch (formControlName) {
        case 'photo':
          this.photoPreview = eventReader.target.result;
          break;
      }
      const config = {
        onUploadProgress: function (progressEvent) {
          switch (formControlName) {
            case 'photo':
              this.photoUploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              break;
          }
        }.bind(this)
      };
      this.fileUploadService.uploadPhotoTemp(eventReader.target.result, config).then(
        response => {
          this.photoUploadProgress = 0;
          const responseBody = response.data.body;
          this.threadForm.controls[formControlName].setValue(responseBody.fullPath);
          Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
            toast: true,
            position: 'top',
            timer: 3000
          });
        },
        error => {
          this.photoUploadProgress = 0;
          Swal.fire({
            title: 'Failed upload file',
            text: error.response.data.message,
            icon: 'error',
          });
        }
      );
    };
    reader.readAsDataURL(event.target.files[0]);
  }
  onDeletePhoto(formControlName) {
    switch (formControlName) {
      case 'photo':
        this.photoPreview = '';
        break;
    }
    this.threadForm.controls[formControlName].setValue('');
  }
  placeChangedCallback(e){
    console.log(e)
  }
  getReplies(f, merge){
    this.apiService.get(
      `api/thread/${f}/replies`,
      {
        params: {
          limit: 3,
          offset: merge ? this.replyThread.length : 0,
          orderBy: 'id',
          orderType: 'desc',
          with: ['user']
        }
      }
    ).then(
      response => {
        this.replyThread = merge ? response.data.body.reverse().concat(this.replyThread) : response.data.body.reverse()
        this.isMoreReply = response.data.body.length == 3;
      }
    );
  }
  sendReply(){
    const message = this.replyMessage.trim()
    this.replyMessage = ""
    if(message !== '') {
      this.apiService.post(
        `api/thread/${this.showThread.id}/replies/store`,
        {
          caption: message
        }
      ).then(response => { this.getReplies(this.showThread.id, false) });
    }
  }
  deleteReplies(f){
    Swal.fire({
      title: 'Delete this replies ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.apiService.delete(
          `api/thread/${this.showThread.id}/replies/${f}/delete`,
          null
        ).then(
          response => {
            this.getReplies(this.showThread.id, false )
          },
          error => {
            Swal.fire(
              'Error!',error.response.data.message,'error'
            );
          }
        );
      }
    });
  }

  loadEvent(merge){
    this.apiService.get(
      `api/thread`,
      {
        params: {
          limit: 5,
          offset: merge ? this.eventList.length : 0,
          filters: {
            contentType: 'event',
            communityId: this.id
          }
        }
      }
    ).then(
      response => {
        this.eventList = merge ? this.eventList.concat(response.data.body) : response.data.body
      }
    );
  }
  loadJob(merge){
    this.apiService.get(
      `api/thread`,
      {
        params: {
          limit: 5,
          offset: merge ? this.jobList.length : 0,
          filters: {
            contentType: 'jobVacancy',
            communityId: this.id
          }
        }
      }
    ).then(
      response => {
        this.jobList = merge ? this.jobList.concat(response.data.body) : response.data.body
      }
    );
  }
  loadMember(merge){
    this.apiService.get(
      `api/communities/${this.id}/member`,
      {
        params: {
          limit: 5,
          offset: merge ? this.memberList.length : 0
        }
      }
    ).then(
      response => {
        this.memberList = merge ? this.memberList.concat(response.data.body.data) : response.data.body.data
      }
    );
  }
  searchMember(e){
    if(e){
      this.apiService.get(
        `api/communities/${this.id}/member`,
        {
          params: {
            keyword: e
          }
        }
      ).then(
        response => {
          this.memberList = response.data.body.data
          this.searchMemberKeys = e
        }
      );
    } else{
      this.searchMemberKeys = '';
      this.loadMember(false)
    } 
  }


  openMember(e,f){
    this.memberOpen = e
    this.modalService.open(f, { centered: true, size: 'sm' });
  }
  userMakeAdmin(e){
    this.apiService.get(
      `api/community/${this.id}/member/${e}/make-as-admin`
    ).then(
      response => {
        console.log(response)
      }
    );
  }
  userKick(e){
    this.apiService.get(
      `api/community/${this.id}/member/${e}/make-as-admin`
    ).then(
      response => {
        console.log(response)
      }
    );
  }
  userBlock(e,f){
    this.apiService.get(
      `api/community/${this.id}/member/${e}/${f}` // f = block | unblock
    ).then(
      response => {
        console.log(response)
      }
    );
  }

  zoomImg(e,f){
    this.imgOpen = e;
    this.modalService.open(f, { centered: true, size: 'lg' });
  }

}
