import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/service/api.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.css']
})
export class ParkingComponent implements OnInit {

  menu = {
    name: 'parking',
    display_name: 'Parking',
    icon: 'fas fa-parking'
  };

  vehicle_types = [
    { id: 'motorbikes', name: 'Motorbikes' },
    { id: 'cars', name: 'Cars' }
  ];

  form: FormGroup;

  gateLimit = 10;
  gateOffset = 0;
  gates = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.initForm();

    this.getAllGates(0);

  }

  initForm() {

    this.form = this.formBuilder.group({
      gate_id: ['', [Validators.required]],
      vehicle_type: ['', [Validators.required]],
      vehicle_police_number: ['', [Validators.required, Validators.minLength(3)]],
      parking_fee: ['', [Validators.required]],
    });

  }

  getFeeByVehicleType(vehicle_type) {

    this.apiService.get(
      `api/parking-fees/get-by-vehicle-type/${vehicle_type}`
    ).then(
      response => {

        const responseBody = response.data.body;

        console.log('responseBody', responseBody);

        this.form.controls.parking_fee.setValue(responseBody.parking_fee);

      },
      error => {
      }
    );
  }

  // Relations 
  getAllGates(offset = this.gateOffset) {

    this.apiService.get(
      `api/gates`,
      {
        params: {
          limit: this.gateLimit,
          offset: offset,
        }
      }
    ).then(
      response => {

        const responseBody = response.data.body;

        if (responseBody.length > 0) {
          this.gateOffset = offset;
        }

        if (this.gateOffset < 1) {
          this.gates = responseBody;
        } else {
          this.gates = this.gates.concat(responseBody);
        }

        this.form.controls.gate_id.updateValueAndValidity();

      },
      error => {
      }
    );
  }

  onSubmit() {
    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        let requestData = JSON.parse(JSON.stringify(this.form.value));

        this.spinner.show();
        this.apiService.post(
          `api/parkings/store`,
          requestData
        ).then(
          response => {
            this.spinner.hide();

            Swal.fire(
              'Success!',
              response.data.message,
              'success'
            );

            this.form.controls.vehicle_police_number.setValue('');

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

    });
  }

}
