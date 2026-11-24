// Accounts for Svapna. Until the public key is set in config.js this does nothing, and everything stays on the device.
// With it: sign in with Google, keep answers and stickers in the account, and carry over what the device already holds.
(function () {
  var cfg = window.SVAPNA_ACCOUNT || {}, ready = Boolean(cfg.live && cfg.url && cfg.key && window.supabase);
  var client = ready ? window.supabase.createClient(cfg.url, cfg.key) : null;
  var read = function (k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } };
  var write = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } };
  var api = {
    ready: ready, client: client, user: null, profile: null,
    signIn: function () { return client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/you' } }); },
    signOut: function () { return client.auth.signOut().then(function () { location.reload(); }); },
    // Everything the member has is removed with the account. The device keeps its own copy until cleared.
    remove: function () { return client.rpc('delete_my_account').then(function (r) { if (r.error) throw r.error; return client.auth.signOut(); }); },
    saveAnswer: function (q, a) {
      if (!api.user) return Promise.resolve();
      return a ? client.from('answers').upsert({ user_id: api.user.id, question_id: q, answer: a, updated_at: new Date().toISOString() })
        : client.from('answers').delete().eq('user_id', api.user.id).eq('question_id', q);
    },
    saveProfile: function (patch) { if (!api.user) return Promise.resolve(); return client.from('profiles').update(patch).eq('id', api.user.id).then(function (r) { if (!r.error) Object.assign(api.profile || {}, patch); return r; }); },
    // Called once per page: resolves with the signed-in user (or null) after the device and the account agree.
    start: function () {
      if (!ready) return Promise.resolve(null);
      return client.auth.getSession().then(function (s) {
        api.user = s.data && s.data.session ? s.data.session.user : null;
        if (!api.user) return null;
        return Promise.all([client.from('profiles').select('*').eq('id', api.user.id).maybeSingle(), client.from('answers').select('question_id,answer').eq('user_id', api.user.id)]).then(function (r) {
          api.profile = r[0].data || {};
          var remote = {}; (r[1].data || []).forEach(function (x) { remote[x.question_id] = x.answer; });
          // The first sign-in carries the device's answers into the account; after that the account is what counts.
          var local = read('svapna_answers', {}), push = Object.keys(local).filter(function (k) { return !remote[k]; });
          var merged = Object.assign({}, local, remote); write('svapna_answers', merged);
          var done = Object.assign({}, api.profile.done || {}, read('svapna_done', {})); var seen = (api.profile.done && api.profile.done.thinkers || []).concat(read('svapna_done', {}).thinkers || []);
          done.thinkers = seen.filter(function (v, i) { return seen.indexOf(v) === i; }).slice(0, 40); write('svapna_done', done);
          var jobs = push.map(function (k) { return api.saveAnswer(k, local[k]); }); jobs.push(api.saveProfile({ done: done }));
          return Promise.all(jobs).then(function () { return api.user; });
        });
      }).catch(function () { return null; });
    },
  };
  window.SvapnaAccount = api;
})();
