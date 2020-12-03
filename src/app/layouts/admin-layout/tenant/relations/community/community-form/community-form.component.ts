import { Location } from '@angular/common';
import { Environment } from './../../../../../../config/environment';
import { FileUploadService } from './../../../../../../service/file-upload.service';
import { APIService } from './../../../../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.css']
})
export class CommunityFormComponent implements OnInit {

  id: any;
  communityId: any;

  showLoader: boolean = false;
  items = [];
  pageData: any;

  form: FormGroup;
  visibleFieldForm: FormGroup;
  visibleFields = [];

  actions = [];

  isUpdate: boolean = false;

  // Files
  logoPreview: any;
  logoUploadProgress: any = 0;

  menu = {
    name: 'community-form',
    display_name: 'Community',
    icon: 'fas fa-users'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService,
    public env: Environment,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        this.pageData = routeData;
      }
    );

    this.initForm();

    const params = this.activatedRoute.snapshot.params;

    if (params.id && params.communityId) {

      this.isUpdate = true;

      this.id = params.id;

      this.communityId = params.communityId;

      this.form.controls.tenant_id.setValue(this.id);

      this.getData();

    } else if (params.id) {

      this.isUpdate = false;

      this.id = params.id;

      this.form.controls.tenant_id.setValue(this.id);

    } else {

      this.isUpdate = false;

    }

  }

  initForm() {

    this.form = this.formBuilder.group({
      tenant_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      bio: ['', []],
      logo: ['', [Validators.required]],
      is_verified: ['', []],
      date_verified: ['', []],
      privacy: ['', [Validators.required]],
      status: ['', []],
      is_active: ['', []],
    });

  }

  getData() {
    this.apiService.get(
      `api/community/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.form.patchValue(responseBody);
      }
    );
  }

  async onPhotoChange(event: any, formControlName) {

    console.log('formControlName', formControlName);

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.helpers.presentToast('Only images are supported', 'top');

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
        case 'logo':
          this.logoPreview = eventReader.target.result;
          break;
      }

      const config = {
        onUploadProgress: function (progressEvent) {

          switch (formControlName) {
            case 'logo':
              this.logoUploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              break;
          }

        }.bind(this)
      };


      this.fileUploadService.uploadPhotoTemp(eventReader.target.result, config).then(
        response => {

          this.logoUploadProgress = 0;

          const responseBody = response.data.body;

          this.form.controls[formControlName].setValue(responseBody.fullPath);

          console.log('this.form.value', this.form.value);

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
          this.logoUploadProgress = 0;

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
      case 'logo':
        this.logoPreview = '';
        break;
    }

    this.form.controls[formControlName].setValue('');
  }

  onSubmit() {

    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        const requestData = JSON.parse(JSON.stringify(this.form.value));

        if (this.isUpdate) {
          this.spinner.show();
          this.apiService.put(
            `api/tenant/${this.id}/relations/community/${this.communityId}/update`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Failed!',
                error.response.data.message,
                'error'
              );
            }
          );
        } else {
          this.spinner.show();
          this.apiService.post(
            `api/tenant/${this.id}/relations/community/store`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Failed!',
                error.response.data.message,
                'error'
              );
            }
          );
        }
      }

    });

  }

}
