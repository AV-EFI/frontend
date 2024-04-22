<template>
  <div>
    <NuxtLayout name="partial-layout-1-center-img">
      <template #title>
        Login
      </template>
      <template #figure>
        <!-- img
          class="hidden lg:inline-flex"
          src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
          alt="Login Figure"
        -->
      </template>
      <template #cardBody>
        <FormKit
          type="form"
          submit-label="Login"
          :submit-attrs="{
            inputClass: 'btn btn-primary',
            'data-theme': `avefi_light`,
            'prefix-icon': 'submit',
            ignore: false
          }"
          @submit="submit"
        >
          <FormKit
            name="identifier"            
            label="Email"
            validation="required|email"
          />
          <FormKit
            type="password"
            label="Password"
            name="password"
            prefix-icon="password"
            suffix-icon="eyeClosed"
            suffix-icon-class="hover:text-blue-500"
            @suffix-icon-click="handleIconClick"
          />
        </FormKit>
      </template>
      <pre>
        "identifier": "regular@tib.eu",
        "password": "regular.user123" 
      </pre>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Credentials from 'next-auth/providers/credentials';
import { string } from 'zod';

definePageMeta({
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/protected/me'
    }
});

/*
const coo = useCookie('auth:token');
if(coo.value) {
    console.log(coo);
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('Accept', 'application/json');
    requestHeaders.set('Authorization', `Bearer ${{coo}}`);
    await $fetch(`/api/admin/data`, {
        method: "GET",
        headers: requestHeaders
    });

}
*/
//const headers = useRequestHeaders(['cookie']) as HeadersInit;
//console.log(headers);

const { signIn, getSession } = await useAuth();
console.log(await getSession());


//const { login } = useStrapiAuth();
//const router = useRouter();

const handleIconClick = (node:FormKitNode, e:Event) => {
    node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye';
    node.props.type = node.props.type === 'password' ? 'text' : 'password';
    console.log(e);
};


async function submit(data:any){
    try {
        const {error, url} = await signIn(Credentials, { callbackUrl: '/protected/me', redirect: true, external:true, identifier: data.identifier, password: data.password } );
        if(error) {
            console.log(error);
            alert("error");
        }
        if(url) {
            console.log(url);
        }
    }
    catch (e) {
        console.error(e);
    }
}
</script>