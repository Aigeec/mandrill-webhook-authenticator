## Modules

<dl>
<dt><a href="#module_MandrillWebhookAuthenticator">MandrillWebhookAuthenticator</a></dt>
<dd><p>Simple express middleware module to authenticate Inbound Mandrill Webhook requests</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Authenticator">Authenticator</a></dt>
<dd></dd>
</dl>

<a name="module_MandrillWebhookAuthenticator"></a>
## MandrillWebhookAuthenticator
Simple express middleware module to authenticate Inbound Mandrill Webhook requests


* [MandrillWebhookAuthenticator](#module_MandrillWebhookAuthenticator)
    * [~MANDRILL_SIGNATURE_HEADER](#module_MandrillWebhookAuthenticator..MANDRILL_SIGNATURE_HEADER) : <code>string</code>
    * [~NOT_AUTHORIZED](#module_MandrillWebhookAuthenticator..NOT_AUTHORIZED) : <code>string</code>
    * [~FORBIDDEN](#module_MandrillWebhookAuthenticator..FORBIDDEN) : <code>string</code>
    * [~OK](#module_MandrillWebhookAuthenticator..OK) : <code>string</code>
    * [~CONFIGURATION_ERROR](#module_MandrillWebhookAuthenticator..CONFIGURATION_ERROR) : <code>Error</code>

<a name="module_MandrillWebhookAuthenticator..MANDRILL_SIGNATURE_HEADER"></a>
### MandrillWebhookAuthenticator~MANDRILL_SIGNATURE_HEADER : <code>string</code>
Mandrill Signature HTTP header

**Kind**: inner constant of <code>[MandrillWebhookAuthenticator](#module_MandrillWebhookAuthenticator)</code>  
<a name="module_MandrillWebhookAuthenticator..NOT_AUTHORIZED"></a>
### MandrillWebhookAuthenticator~NOT_AUTHORIZED : <code>string</code>
**Kind**: inner constant of <code>[MandrillWebhookAuthenticator](#module_MandrillWebhookAuthenticator)</code>  
<a name="module_MandrillWebhookAuthenticator..FORBIDDEN"></a>
### MandrillWebhookAuthenticator~FORBIDDEN : <code>string</code>
**Kind**: inner constant of <code>[MandrillWebhookAuthenticator](#module_MandrillWebhookAuthenticator)</code>  
<a name="module_MandrillWebhookAuthenticator..OK"></a>
### MandrillWebhookAuthenticator~OK : <code>string</code>
**Kind**: inner constant of <code>[MandrillWebhookAuthenticator](#module_MandrillWebhookAuthenticator)</code>  
<a name="module_MandrillWebhookAuthenticator..CONFIGURATION_ERROR"></a>
### MandrillWebhookAuthenticator~CONFIGURATION_ERROR : <code>Error</code>
**Kind**: inner constant of <code>[MandrillWebhookAuthenticator](#module_MandrillWebhookAuthenticator)</code>  
<a name="Authenticator"></a>
## Authenticator
**Kind**: global class  

* [Authenticator](#Authenticator)
    * [new Authenticator(options)](#new_Authenticator_new)
    * [~isValidMandrillSignature(fullUrl, body, key, signature)](#Authenticator..isValidMandrillSignature) ⇒ <code>boolean</code>
    * [~sortPostParameters(body)](#Authenticator..sortPostParameters) ⇒ <code>string</code>
    * [~getHash(text, key)](#Authenticator..getHash)
    * [~responder(res, status, message)](#Authenticator..responder)
    * [~validator(fullUrl, body, signature)](#Authenticator..validator) ⇒ <code>function</code>
    * [~authenticate(req, res, next)](#Authenticator..authenticate)

<a name="new_Authenticator_new"></a>
### new Authenticator(options)
Creates the middleware function to be used to authenticate the inbound Mandrill webhook

**Returns**: <code>function</code> - @see [authenticate](#Authenticator..authenticate)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Set of configuration values |
| options.webhookAuthKey | <code>string</code> | Key of the Inbound Webhook provied by Mandrill |
| options.domain | <code>string</code> | Domain of the Inbound Webhook url as set up on Mandrill |

<a name="Authenticator..isValidMandrillSignature"></a>
### Authenticator~isValidMandrillSignature(fullUrl, body, key, signature) ⇒ <code>boolean</code>
Generate the signature from the full url and sorted post data to compart to the one provided.
When mandrill is testing the existence of a url it can send a post request with no events and key set to 'test-webhook'.

**Kind**: inner method of <code>[Authenticator](#Authenticator)</code>  
**Returns**: <code>boolean</code> - True is signature is valid otherwise false  

| Param | Type | Description |
| --- | --- | --- |
| fullUrl | <code>string</code> | domain and url of request - should match exactly the url specified in the webhook |
| body | <code>string</code> | request body |
| key | <code>string</code> | Mandrill Inbound Webhook auth key |
| signature | <code>string</code> | signature provided in the 'x-mandrill-signature' header |

<a name="Authenticator..sortPostParameters"></a>
### Authenticator~sortPostParameters(body) ⇒ <code>string</code>
Sort the post parameters alphabetically and append each POST variable's key and value with no delimiter.

**Kind**: inner method of <code>[Authenticator](#Authenticator)</code>  
**Returns**: <code>string</code> - string of sorted key values with no delimiter  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>string</code> | Post body |

<a name="Authenticator..getHash"></a>
### Authenticator~getHash(text, key)
Hash the resulting string with HMAC-SHA1, using your webhook's authentication key to generate a binary signature and Base64 encode.

**Kind**: inner method of <code>[Authenticator](#Authenticator)</code>  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Full URL and sorted post data |
| key | <code>string</code> | Mandrill Inbound Webhook auth key |

<a name="Authenticator..responder"></a>
### Authenticator~responder(res, status, message)
Utility function to set http reponse status and message, uses HTTP compatible properties so express is not required

**Kind**: inner method of <code>[Authenticator](#Authenticator)</code>  

| Param | Type | Description |
| --- | --- | --- |
| res | <code>Response</code> | Response |
| status | <code>int</code> | HTTP status code |
| message | <code>string</code> | Response body |

<a name="Authenticator..validator"></a>
### Authenticator~validator(fullUrl, body, signature) ⇒ <code>function</code>
Utility function to preset the calls to the signature validator

**Kind**: inner method of <code>[Authenticator](#Authenticator)</code>  
**Returns**: <code>function</code> - a fuction that takes the key and call isValidMandrillSignature  

| Param | Type | Description |
| --- | --- | --- |
| fullUrl | <code>string</code> | domain and url of request - should match exactly the url specified in the webhook |
| body | <code>string</code> | request body |
| signature | <code>string</code> | signature provided in the 'x-mandrill-signature' header |

<a name="Authenticator..authenticate"></a>
### Authenticator~authenticate(req, res, next)
Express middleware compatible function to process requests and only continure if the signature is valid. Will return 200 if the request is a test request. It does not update the request.

**Kind**: inner method of <code>[Authenticator](#Authenticator)</code>  

| Param | Type |
| --- | --- |
| req | <code>Request</code> | 
| res | <code>Response</code> | 
| next | <code>function</code> | 

