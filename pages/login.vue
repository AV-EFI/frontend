<template>
  <div>
    <div
      role="alert"
      class="alert bg-neutral-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-info h-6 w-6 shrink-0"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Login später über AcademicCloud</span>
    </div>
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
            'prefix-icon': 'submit',
            ignore: false,
          }"
          @submit="submitTemp"
        >
          <FormKit
            name="identifier"            
            label="Email"
            value="123@academic.id"
            placeholder="123@academic.id"
            validation="required|email"
          />
          <FormKit
            type="password"
            label="Password"
            name="password"
            value="AVefiSecretPassword"
            placeholder="AVefiSecretPassword"
            prefix-icon="password"
            suffix-icon="eyeClosed"
            suffix-icon-class="hover:text-blue-500"
            @suffix-icon-click="handleIconClick"
          />
        </FormKit>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const Credentials = null;

definePageMeta({
    /*
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/protected/me'
    }
        */
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

//const { signIn, getSession } = await useAuth();
const signIn = null; 
const getSession = null;
//console.log(await getSession());


//const { login } = useStrapiAuth();
//const router = useRouter();

const handleIconClick = (node:FormKitNode, e:Event) => {
    node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye';
    node.props.type = node.props.type === 'password' ? 'text' : 'password';
    console.log(e);
};

async function submitTemp (data:any) {
    const t = setTimeout(() => {
        return navigateTo('/protected/filmedit');
    }, 1000);
}

async function submit(data:any){
    /*
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
        */
}
</script>