import { Component } from '@angular/core';
import { FormBuilder ,FormGroup,Validators } from '@angular/forms';
import { valid } from 'semver';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm !:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService
  ){}

  ngOnInit():void{
    this.initSignupForm();
  }
  
  initSignupForm():void{
    this.signupForm=this.formBuilder.group({
      email:['',[Validators.email,Validators.required]],
      password:['',[Validators.required,Validators.minLength(8)]],
      passwordConfirm:['',[Validators.required]],
      cguCheck:[false,[Validators.requiredTrue]]
    })
  }
  onSubmitSignupForm():void{
    this.authService.signupUser(this.signupForm.value.email,this.signupForm.value.password)
    .then(user=>{
      console.log(user);
      //REDIRIGER L'UTILISATEUR
    }).catch(console.error);

  }



}
