# SMTP SSL Error Fix

## Error Message

```
Error: 80ECEBE9DE7F0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number
```

This error occurs when there's a mismatch between the SSL/TLS configuration and the SMTP port being used.

---

## Root Cause

The error "wrong version number" happens when:
- Using `secure: true` (SSL) with port **587** (which uses STARTTLS, not SSL)
- Port 587 uses **STARTTLS** (upgrades plain connection to TLS)
- Port 465 uses **SSL/TLS** directly (requires `secure: true`)

---

## Solution

### For Port 587 (Gmail default - STARTTLS):
- ❌ **Don't use** `secure: true`
- ✅ Use STARTTLS (automatic with port 587)
- ✅ The action handles STARTTLS automatically

### For Port 465 (SSL):
- ✅ **Use** `secure: true`
- ✅ Direct SSL/TLS connection

---

## Fix Applied

Updated the workflow to conditionally set `secure` based on port:

```yaml
server_port: ${{ secrets.SMTP_PORT || 587 }}
secure: ${{ secrets.SMTP_PORT == '465' || secrets.SMTP_PORT == 465 }}
```

**Behavior:**
- Port 587 (default): `secure: false` → Uses STARTTLS
- Port 465: `secure: true` → Uses SSL/TLS directly

---

## Gmail SMTP Ports

### Port 587 (Recommended - STARTTLS)
```yaml
SMTP_SERVER: smtp.gmail.com
SMTP_PORT: 587
secure: false  # STARTTLS is automatic
```

**Advantages:**
- ✅ More compatible
- ✅ Works with most firewalls
- ✅ STARTTLS upgrades connection

### Port 465 (SSL)
```yaml
SMTP_SERVER: smtp.gmail.com
SMTP_PORT: 465
secure: true  # Direct SSL/TLS
```

**Advantages:**
- ✅ Direct SSL connection
- ✅ Some networks prefer this

---

## Updated Configuration

The workflow now automatically:
- ✅ Uses STARTTLS for port 587 (no `secure: true`)
- ✅ Uses SSL for port 465 (with `secure: true`)
- ✅ Handles both ports correctly

---

## Testing

After the fix:
1. **Port 587 (default):**
   - Set `SMTP_PORT: 587` or leave unset
   - `secure` will be `false` → Uses STARTTLS
   - Should work without SSL errors

2. **Port 465 (if preferred):**
   - Set `SMTP_PORT: 465` in secrets
   - `secure` will be `true` → Uses SSL
   - Should work with direct SSL

---

## Alternative: Explicit Configuration

If you want to be explicit, you can set:

```yaml
# For STARTTLS (port 587)
server_port: 587
secure: false

# OR for SSL (port 465)
server_port: 465
secure: true
```

---

## Summary

✅ **Fixed:** Removed `secure: true` for port 587  
✅ **Added:** Conditional `secure` based on port  
✅ **Result:** Port 587 uses STARTTLS, port 465 uses SSL  

The SSL error should now be resolved! 🎉

