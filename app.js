  //
  // === FIREBASE + IMGBB STEPS TRACKER ===
  //

  const IMGBB_API_KEY = 'a16ca1b4f6677cff37245039aee957f5';

  const StepsTracker = {
    // ---- Config and state
    participants: ["Del", "Giem", "Glaiz", "Jeun", "Joy", "Kokoy", "Leanne", "Lui", "Ramon", "Robert", "Sarah", "Sheila", "Shin", "Yohan", "Zephanny", "Sam"],
    targetSteps: 10000,
    penaltyAmount: 50,
    adminPassword: 'steps2025',
    paymentDetails: { name: "YOUR NAME", number: "09123456789" },
    entries: [],
    isAdminMode: false,
    editingEntry: null,
    confirmCallback: null,
    participantToVerify: null,

    async init() {
      await this.waitForFirebase();
      this.displayPaymentDetails();
      await this.loadData();
      this.setupParticipantSelect();
      this.setupEventListeners();
      this.setDefaultDate();
      this.setParticipantMode();
      this.updateAllDisplays();
    },

    async waitForFirebase() {
      let attempts = 0;
      while (!window.firebaseReady && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      if (!window.firebaseReady) {
        this.showMessage('Firebase failed to load. Please refresh.', 'error');
        throw new Error('Firebase not ready');
      }
    },

    setupParticipantSelect() {
      const select = document.getElementById('participant-select');
      if (!select) return;
      while (select.options.length > 1) select.remove(1);
      this.participants.forEach(p => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = p;
        select.appendChild(opt);
      });
    },

    displayPaymentDetails() {
      const nameEl = document.getElementById('admin-name');
      const numEl = document.getElementById('admin-number');
      if (nameEl) nameEl.textContent = this.paymentDetails.name;
      if (numEl) numEl.textContent = this.paymentDetails.number;
    },

    setupEventListeners() {
      const entryForm = document.getElementById('entry-form') || document.getElementById('submit-form');
      if (entryForm) entryForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

      const paymentForm = document.getElementById('payment-proof-form');
      if (paymentForm) paymentForm.addEventListener('submit', (e) => this.handlePaymentProofSubmit(e));

      // Admin toggle with exit functionality
      const adminToggle = document.getElementById('admin-toggle');
      if (adminToggle) adminToggle.addEventListener('click', () => {
        if (this.isAdminMode) {
          // Exit admin mode
          this.isAdminMode = false;
          adminToggle.textContent = '🔐 Enable Admin Mode';
          this.showMessage('Admin mode disabled.', 'info');
          this.updateAllDisplays();
        } else {
          // Enter admin mode
          const pwd = prompt('Enter admin password:');
          if (pwd === this.adminPassword) {
            this.isAdminMode = true;
            adminToggle.textContent = '🔓 Exit Admin Mode';
            this.showMessage('Admin mode enabled.', 'success');
            this.updateAllDisplays();
          } else if (pwd) {
            this.showMessage('Incorrect password.', 'error');
          }
        }
      });

      // Copy payment message button
      const copyBtn = document.getElementById('copy-payment-message');
      if (copyBtn) copyBtn.addEventListener('click', () => {
        const textarea = document.getElementById('payment-message-text');
        textarea.select();
        document.execCommand('copy');
        this.showMessage('Payment message copied!', 'success');
      });
      // Export CSV button
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    this.exportToCSV();
  });
      

      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
      });

      const nameFilter = document.getElementById('name-filter');
      if (nameFilter) nameFilter.addEventListener('input', () => this.updateTrackerDisplay());
      const dateFrom = document.getElementById('date-from');
      if (dateFrom) dateFrom.addEventListener('change', () => this.updateTrackerDisplay());
      const dateTo = document.getElementById('date-to');
      if (dateTo) dateTo.addEventListener('change', () => this.updateTrackerDisplay());
      const clearBtn = document.getElementById('clear-filters');
      if (clearBtn) clearBtn.addEventListener('click', () => this.clearFilters());

      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-close-modal');
          const el = document.getElementById(target);
          if (el) el.classList.add('hidden');
        });
      });

      const extraClose = [
        'close-payment-proof-modal','cancel-payment-proof',
        'close-admin-verify-modal','close-step-proof-viewer',
        'close-modal','cancel-edit'
      ];
      extraClose.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => {
          const map = {
            'close-payment-proof-modal':'payment-proof-modal',
            'cancel-payment-proof':'payment-proof-modal',
            'close-admin-verify-modal':'admin-verify-modal',
            'close-step-proof-viewer':'step-proof-viewer-modal',
            'close-modal':'edit-modal',
            'cancel-edit':'edit-modal'
          };
          const target = document.getElementById(map[id]);
          if (target) target.classList.add('hidden');
        });
      });
    },

    switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `${tab}-tab`));
      this.updateAllDisplays();
    },

    clearFilters() {
      const nf = document.getElementById('name-filter');
      const df = document.getElementById('date-from');
      const dt = document.getElementById('date-to');
      if (nf) nf.value = '';
      if (df) df.value = '';
      if (dt) dt.value = '';
      this.updateTrackerDisplay();
    },

    setDefaultDate() {
      const dateInput = document.getElementById('date-input');
      if (dateInput && !dateInput.value) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${y}-${m}-${d}`;
      }
    },

    setParticipantMode() {
      const meSelect = document.getElementById('participant-select');
      if (!meSelect) return;
    },

    showMessage(msg, type = 'info') {
      const box = document.getElementById('message-box');
      if (!box) { console.log(`[${type}]`, msg); return; }
      box.textContent = msg;
      box.className = `message message--${type}`;
      box.classList.remove('hidden');
      setTimeout(() => box.classList.add('hidden'), 3000);
    },

    clearForm() {
      const form = document.getElementById('entry-form') || document.getElementById('submit-form');
      if (form) form.reset();
      this.setDefaultDate();
    },

    // ---- Firebase Data Operations
    async loadData() {
      try {
        this.showMessage('Loading data...', 'info');

        const { getDocs, collection } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
        const querySnapshot = await getDocs(collection(window.db, 'entries'));

        this.entries = [];
        querySnapshot.forEach((doc) => {
          this.entries.push({ firebaseId: doc.id, ...doc.data() });
        });

        this.showMessage('Data loaded.', 'success');
      } catch (e) {
        this.showMessage(`Error loading: ${e.message}`, 'error');
        console.error('Load error:', e);
      }
    },

    // ---- Image Compression + ImgBB Upload
    async compressImage(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            const maxSize = 1200;
            if (width > height && width > maxSize) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width / height) * maxSize;
              height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            }, 'image/jpeg', 0.8);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    async uploadFile(file) {
      if (!file) throw new Error("No file provided.");

      this.showMessage("Compressing image...", "info");
      const compressed = await this.compressImage(file);

      this.showMessage("Uploading image...", "info");

      const fd = new FormData();
      fd.append("image", compressed);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }

      this.showMessage("Image uploaded!", "success");
      return data.data.url;
    },

    // ---- CRUD Operations
    async addEntry(participant, date, steps, proofUrl) {
      const duplicate = this.entries.find(e => !e.paymentStatus && e.participant === participant && e.date === date);
      if (duplicate) {
        this.showMessage(`${participant} already has an entry for ${new Date(date).toLocaleDateString()}!`, 'error');
        return false;
      }

      try {
        const { addDoc, collection } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');

        const newEntry = {
          id: `${participant}-${date}`,
          participant,
          date,
          steps: parseInt(steps, 10),
          proof: proofUrl,
          isPaid: false
        };

        const docRef = await addDoc(collection(window.db, 'entries'), newEntry);
        this.entries.push({ firebaseId: docRef.id, ...newEntry });
        return true;
      } catch (e) {
        this.showMessage(`Error adding entry: ${e.message}`, 'error');
        return false;
      }
    },

    async editEntry(id, newSteps) {
      try {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');

        const entry = this.entries.find(e => e.id === id);
        if (!entry) throw new Error('Entry not found');

        await updateDoc(doc(window.db, 'entries', entry.firebaseId), {
          steps: parseInt(newSteps, 10)
        });

        entry.steps = parseInt(newSteps, 10);
        return true;
      } catch (e) {
        this.showMessage(`Error updating: ${e.message}`, 'error');
        return false;
      }
    },

    async deleteEntry(id) {
      try {
        const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');

        const entry = this.entries.find(e => e.id === id);
        if (!entry) throw new Error('Entry not found');

        await deleteDoc(doc(window.db, 'entries', entry.firebaseId));
        this.entries = this.entries.filter(e => e.id !== id);
        return true;
      } catch (e) {
        this.showMessage(`Error deleting: ${e.message}`, 'error');
        return false;
      }
    },

    // ---- Form Handlers
    async handleFormSubmit(event) {
    event.preventDefault();
    const p = document.getElementById('participant-select')?.value;
    const d = document.getElementById('date-input')?.value;
    const s = document.getElementById('steps-input')?.value;
    const f = document.getElementById('proof-upload')?.files[0];

    if (!p || !d || !s || !f) {
      this.showMessage('Please fill all fields.', 'error');
      return;
    }

    try {
      const proofUrl = await this.uploadFile(f);
      const ok = await this.addEntry(p, d, s, proofUrl);

      if (!ok) {
        // addEntry already showed the error message (duplicate entry, etc.)
        return;
      }

      this.showMessage(`Entry added for ${p}!`, 'success');
      this.clearForm();
      this.updateAllDisplays();
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
      this.showMessage(error.message, 'error');
    }
  },

    async handlePaymentProofSubmit(event) {
      event.preventDefault();
      const file = document.getElementById('payment-proof-upload')?.files[0];
      if (!file) {
        this.showMessage("Please select a file.", "error");
        return;
      }

      try {
        const proofUrl = await this.uploadFile(file);
        const participant = this.participantToVerify;
        if (!participant) {
          this.showMessage("No participant selected.", "error");
          return;
        }

        let entry = this.entries.find(e => e.participant === participant && e.paymentStatus === "pending");

        const { addDoc, collection, updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');

        if (!entry) {
          entry = {
            id: `pay-${Date.now()}-${participant}`,
            participant,
            date: new Date().toISOString().slice(0,10),
            paymentStatus: 'pending',
            paymentProof: proofUrl
          };
          const docRef = await addDoc(collection(window.db, 'entries'), entry);
          this.entries.push({ firebaseId: docRef.id, ...entry });
        } else {
          await updateDoc(doc(window.db, 'entries', entry.firebaseId), {
            paymentProof: proofUrl
          });
          entry.paymentProof = proofUrl;
        }

        this.showMessage("Payment proof submitted!", "success");
        this.updateAllDisplays();
        document.getElementById('payment-proof-modal')?.classList.add('hidden');
        const input = document.getElementById('payment-proof-upload');
        if (input) input.value = "";
        this.participantToVerify = null;
      } catch (err) {
        this.showMessage(err.message, "error");
        console.error(err);
      }
    },

    // ---- Admin Actions
    openPaymentProofModal(participant) {
      const s = this.getParticipantSummary(participant);
      if (s.amountOwed === 0) {
        this.showMessage("No balance.", "info");
        return;
      }

      document.getElementById('payment-amount-due').textContent = `₱${s.amountOwed}`;

      // Show admin payment details in modal
      document.getElementById('modal-admin-name').textContent = this.paymentDetails.name;
      document.getElementById('modal-admin-number').textContent = this.paymentDetails.number;

      // Create payment message
      const paymentMessage = `Hi ${this.paymentDetails.name}! I'm sending ₱${s.amountOwed} for my 10K Steps penalty. - ${participant}`;
      document.getElementById('payment-message-text').value = paymentMessage;

      this.participantToVerify = participant;
      document.getElementById('payment-proof-modal').classList.remove('hidden');
    },

    openAdminVerifyModal(participant) {
      this.participantToVerify = participant;
      const e = this.entries.find(en => en.participant === participant && en.paymentStatus === 'pending' && en.paymentProof);
      if (!e) {
        this.showMessage("No proof found.", "error");
        return;
      }
      const img = document.getElementById('admin-verify-image');
      document.getElementById('admin-verify-title').textContent = `Verify Payment for ${participant}`;
      img.src = e.paymentProof;
      document.getElementById('admin-verify-modal').classList.remove('hidden');
    },

    async approvePayment(participant) {
      const pending = this.entries.find(e => e.participant === participant && e.paymentStatus === 'pending' && e.paymentProof);
      if (!pending) {
        this.showMessage("No pending proof.", "error");
        return;
      }

      this.showMessage("Processing approval...", "info");

      try {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');

        for (const e of this.entries) {
          if (!e.paymentStatus && e.participant === participant && e.steps < this.targetSteps && !e.isPaid) {
            await updateDoc(doc(window.db, 'entries', e.firebaseId), { isPaid: true });
            e.isPaid = true;
          }
        }

        await updateDoc(doc(window.db, 'entries', pending.firebaseId), { paymentStatus: 'approved' });
        pending.paymentStatus = 'approved';

        this.showMessage(`Payment approved for ${participant}`, "success");
        document.getElementById('admin-verify-modal')?.classList.add('hidden');
        this.updateAllDisplays();
      } catch (e) {
        this.showMessage("Failed to approve.", "error");
        console.error(e);
      }
    },

    confirmDelete(id) {
      if (!confirm('Delete this entry?')) return;
      this.deleteEntry(id).then(ok => {
        this.showMessage(ok ? 'Entry deleted.' : 'Failed to delete.', ok ? 'success' : 'error');
        this.updateAllDisplays();
      });
    },

    openEditModal(id) {
      const entry = this.entries.find(e => e.id === id && !e.paymentStatus);
      if (!entry) return this.showMessage('Entry not found.', 'error');
      const input = document.getElementById('edit-steps-input');
      if (input) input.value = entry.steps;
      const saveBtn = document.getElementById('edit-save-btn');
      if (saveBtn) {
        saveBtn.onclick = async () => {
          const newSteps = parseInt(document.getElementById('edit-steps-input').value, 10);
          const ok = await this.editEntry(id, newSteps);
          this.showMessage(ok ? 'Entry updated.' : 'Failed to update.', ok ? 'success' : 'error');
          document.getElementById('edit-modal').classList.add('hidden');
          this.updateAllDisplays();
        };
      }
      document.getElementById('edit-modal').classList.remove('hidden');
    },

    openProofViewer(id) {
      const e = this.entries.find(en => en.id === id);
      const proofUrl = e?.proof || e?.paymentProof;
      if (proofUrl) {
        const img = document.getElementById('step-proof-image');
        img.src = proofUrl;
        document.getElementById('step-proof-viewer-modal').classList.remove('hidden');
      } else {
        this.showMessage("No proof.", "info");
      }
    },

    // ---- Calculations
    getParticipantSummary(name) {
      const es = this.entries.filter(e => e.participant === name && !e.paymentStatus);
      const totalDays = es.length;
      const daysMissed = es.filter(e => e.steps < this.targetSteps).length;
      const amountOwed = es.filter(e => e.steps < this.targetSteps && !e.isPaid).length * this.penaltyAmount;
      const completedDays = es.filter(e => e.steps >= this.targetSteps).length;
      const completionRate = totalDays ? (completedDays / totalDays) * 100 : 0;
      return { participant: name, totalDays, daysMissed, amountOwed, completionRate };
    },

    calculateStatus(steps) {
      return steps >= this.targetSteps ? 'Met' : 'Missed';
    },

    calculateAmountOwed(steps, isPaid, paymentStatus) {
      if (paymentStatus) return 0;
      if (steps >= this.targetSteps) return 0;
      return isPaid ? 0 : this.penaltyAmount;
    },

    // ---- Display Updates
     updateAllDisplays() {
    this.updateTrackerDisplay();
    this.updateSummaryDisplay();
    this.updateLeaderboardDisplay();
    this.updateDashboard(); // Always update dashboard

    // Show/hide admin-only elements
    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.toggle('visible', this.isAdminMode);
      el.classList.toggle('hidden', !this.isAdminMode);
    });
  },
 // ---- Dashboard
  updateDashboard() {
    const today = new Date().toISOString().slice(0, 10);

    // At-Risk List
    const submittedToday = this.entries
      .filter(e => !e.paymentStatus && e.date === today)
      .map(e => e.participant);

    const atRisk = this.participants.filter(p => !submittedToday.includes(p));

    const atRiskEl = document.getElementById('at-risk-content');
    if (atRiskEl) {
      if (atRisk.length === 0) {
        atRiskEl.innerHTML = '✅ Everyone has submitted today!';
        atRiskEl.parentElement.style.background = '#d1fae5';
        atRiskEl.parentElement.style.borderLeftColor = '#10b981';
      } else {
        atRiskEl.innerHTML = atRisk.map(p => `<span style="display: inline-block; background: white; padding: 4px 8px; margin: 4px; border-radius: 4px;">${p}</span>`).join('');
        atRiskEl.parentElement.style.background = '#fef3c7';
        atRiskEl.parentElement.style.borderLeftColor = '#f59e0b';
      }
    }

    // Weekly Stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoStr = oneWeekAgo.toISOString().slice(0, 10);

    const weekEntries = this.entries.filter(e => !e.paymentStatus && e.date >= weekAgoStr);
    const weekSubmissions = weekEntries.length;
    const weekSuccess = weekEntries.filter(e => e.steps >= this.targetSteps).length;
    const weekSuccessRate = weekSubmissions ? ((weekSuccess / weekSubmissions) * 100).toFixed(1) : 0;
    const weekPenalties = weekEntries.filter(e => e.steps < this.targetSteps).length * this.penaltyAmount;
    const pendingPayments = this.entries.filter(e => e.paymentStatus === 'pending' && e.paymentProof).length;

    const weekSubEl = document.getElementById('week-submissions');
    const weekRateEl = document.getElementById('week-success-rate');
    const weekPenEl = document.getElementById('week-penalties');
    const pendingEl = document.getElementById('pending-payments');

    if (weekSubEl) weekSubEl.textContent = weekSubmissions;
    if (weekRateEl) weekRateEl.textContent = `${weekSuccessRate}%`;
    if (weekPenEl) weekPenEl.textContent = `₱${weekPenalties}`;
    if (pendingEl) pendingEl.textContent = pendingPayments;
  },

  exportToCSV() {
    const stepEntries = this.entries.filter(e => !e.paymentStatus);

    const csv = [
      ['Date', 'Participant', 'Steps', 'Status', 'Amount Owed', 'Paid'].join(','),
      ...stepEntries.map(e => [
        e.date,
        e.participant,
        e.steps,
        this.calculateStatus(e.steps),
        this.calculateAmountOwed(e.steps, e.isPaid, e.paymentStatus),
        e.isPaid ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steps-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    this.showMessage('CSV exported!', 'success');
  },
    updateTrackerDisplay() {
      const t = document.getElementById('tracker-tbody');
      if (!t) return;

      const stepEntries = (this.entries || []).filter(e => !e.paymentStatus);

      if (stepEntries.length === 0) {
        t.innerHTML = `<tr><td colspan="${this.isAdminMode ? 7 : 6}">No entries yet.</td></tr>`;
        return;
      }

      const nameFilter = document.getElementById('name-filter')?.value?.toLowerCase() || '';
      const dateFrom = document.getElementById('date-from')?.value || '';
      const dateTo = document.getElementById('date-to')?.value || '';

      let filteredEntries = [...stepEntries];
      if (nameFilter) filteredEntries = filteredEntries.filter(e => e.participant.toLowerCase().includes(nameFilter));
      if (dateFrom) filteredEntries = filteredEntries.filter(e => e.date >= dateFrom);
      if (dateTo) filteredEntries = filteredEntries.filter(e => e.date <= dateTo);

      const sorted = filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sorted.length === 0) {
        t.innerHTML = `<tr><td colspan="${this.isAdminMode ? 7 : 6}">No entries matching filters.</td></tr>`;
        return;
      }

      t.innerHTML = sorted.map(e => {
        const st = this.calculateStatus(e.steps);
        const owed = this.calculateAmountOwed(e.steps, e.isPaid, e.paymentStatus);

        const proofUrl = e.proof;
        const proofHtml = proofUrl
          ? `<img src="${proofUrl}"
                   alt="Proof"
                   class="proof-image"
                   loading="lazy"
                   onclick="StepsTracker.openProofViewer('${e.id}')">`
          : '<span class="proof-text">No Proof</span>';

        const adminCell = this.isAdminMode
          ? `<td>
               <button class="btn-edit" onclick="StepsTracker.openEditModal('${e.id}')">Edit</button>
               <button class="btn-delete" onclick="StepsTracker.confirmDelete('${e.id}')">Delete</button>
             </td>`
          : '';

        return `<tr>
          <td>${new Date(e.date).toLocaleDateString()}</td>
          <td>${e.participant}</td>
          <td>${e.steps.toLocaleString()}</td>
          <td><span class="status-${st.toLowerCase()}">${st}</span></td>
          <td>${proofHtml}</td>
          <td>₱${owed}</td>
          ${adminCell}
        </tr>`;
      }).join('');
    },

    updateSummaryDisplay() {
      const t = document.getElementById('summary-tbody');
      if (!t) return;
      if (!this.entries || this.entries.length === 0) {
        t.innerHTML = `<tr><td colspan="6">No data yet.</td></tr>`;
        return;
      }

      const summaries = this.participants.map(p => this.getParticipantSummary(p));

      t.innerHTML = summaries.map(sm => {
        let actionCell = '';
        if (this.isAdminMode) {
          if (sm.amountOwed > 0) {
            const pendingPay = this.entries.find(e => e.participant === sm.participant && e.paymentStatus === 'pending');
            const proofHtml = pendingPay?.paymentProof
              ? `<img src="${pendingPay.paymentProof}"
                       alt="Payment Proof"
                       class="proof-image"
                       loading="lazy"
                       onclick="StepsTracker.openAdminVerifyModal('${sm.participant}')">`
              : '<span class="proof-text">No Proof</span>';
            actionCell = `<td class="summary-actions">
              ${proofHtml}
              <button class="btn btn--sm btn-warning" onclick="StepsTracker.openAdminVerifyModal('${sm.participant}')">Verify</button>
              <button class="btn btn--sm" onclick="StepsTracker.approvePayment('${sm.participant}')">Mark Paid</button>
            </td>`;
          } else {
            actionCell = `<td class="summary-actions"><span class="status status--success">Paid Up!</span></td>`;
          }
        } else {
    if (sm.amountOwed > 0) {
      // Check if there's a pending payment proof
      const pendingPay = this.entries.find(e => e.participant === sm.participant && e.paymentStatus === 'pending' && e.paymentProof);

      if (pendingPay) {
        actionCell = `<td><span class="status status--warning">⏳ Pending Approval</span></td>`;
      } else {
        actionCell = `<td><button class="btn btn--sm btn-primary" onclick="StepsTracker.openPaymentProofModal('${sm.participant}')">Settle</button></td>`;
      }
    } else {
      actionCell = `<td><span class="status status--success">✅ Paid Up!</span></td>`;
    }
  }

        return `
          <tr>
            <td>${sm.participant}</td>
            <td>${sm.totalDays}</td>
            <td>${sm.daysMissed}</td>
            <td>₱${sm.amountOwed}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${sm.completionRate}%"></div>
              </div>
              <div class="progress-text">${sm.completionRate.toFixed(1)}%</div>
            </td>
            ${actionCell}
          </tr>`;
      }).join('');
    },

    updateLeaderboardDisplay() {
    const t = document.getElementById('leaderboard-tbody');
    if (!t) return;
    const stepEntries = (this.entries || []).filter(e => !e.paymentStatus);
    if (stepEntries.length === 0) {
      t.innerHTML = `<tr><td colspan="8">No data.</td></tr>`;
      const grand = document.getElementById('grand-total-paid');
      if (grand) grand.textContent = `₱0`;
      this.updateTeamStats([], 0, 0, 0, 0);
      return;
    }

    const byParticipant = {};
    stepEntries.forEach(e => {
      if (!byParticipant[e.participant]) {
        byParticipant[e.participant] = { steps: [], dates: [], images: [] };
      }
      byParticipant[e.participant].steps.push(e.steps);
      byParticipant[e.participant].dates.push(e.date);
      if (e.imageUrl) byParticipant[e.participant].images.push(e.imageUrl);
    });

    const stats = Object.keys(byParticipant).map(p => {
      const arr = byParticipant[p].steps;
      const dates = byParticipant[p].dates;
      const sum = arr.reduce((a, b) => a + b, 0);
      const avg = sum / arr.length;
      const successful = arr.filter(s => s >= this.targetSteps).length;
      const successRate = ((successful / arr.length) * 100).toFixed(0);

      // Calculate streak
      const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b - a);
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedDates.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        if (sortedDates[i].getTime() === checkDate.getTime() && arr[dates.indexOf(sortedDates[i].toISOString().split('T')[0])] >= this.targetSteps) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      // Calculate distance (steps × 0.762m / 1000 = km)
      const distance = (sum * 0.762 / 1000).toFixed(1);

      // Calculate calories (steps × 0.04)
      const calories = (sum * 0.04).toFixed(0);

      // Find best day
      const maxSteps = Math.max(...arr);
      const bestDayIndex = arr.indexOf(maxSteps);
      const bestDay = new Date(dates[bestDayIndex]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Calculate trend (last 3 days vs previous 3 days)
      let trend = '—';
      if (arr.length >= 6) {
        const recent3 = arr.slice(-3).reduce((a, b) => a + b, 0) / 3;
        const previous3 = arr.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
        const diff = ((recent3 - previous3) / previous3 * 100).toFixed(0);
        if (diff > 5) trend = `<span class="trend-up">↗ ${diff}%</span>`;
        else if (diff < -5) trend = `<span class="trend-down">↘ ${diff}%</span>`;
        else trend = `<span class="trend-stable">→ ${diff}%</span>`;
      }

      const achievements = this.calculateAchievements(arr, dates, streak);

      return { participant: p, sum, avg, successful, successRate, streak, distance, calories, bestDay: `${maxSteps.toLocaleString()} (${bestDay})`, achievements, trend };
    });

    stats.sort((a, b) => b.successRate - a.successRate || b.sum - a.sum);

    let rows = '';
    stats.forEach((s, idx) => {
      const rank = idx + 1;
      let rankDisplay = rank;
      let rankClass = '';

      if (rank === 1) {
        rankDisplay = '🥇';
        rankClass = 'rank-1';
      } else if (rank === 2) {
        rankDisplay = '🥈';
        rankClass = 'rank-2';
      } else if (rank === 3) {
        rankDisplay = '🥉';
        rankClass = 'rank-3';
      }

      const achievementBadges = s.achievements.map(a => `<span class="achievement-badge" title="${a.desc}">${a.icon}</span>`).join('');

      rows += `
        <tr class="${rankClass}">
          <td class="rank-cell">${rankDisplay}</td>
          <td>${s.participant}</td>
          <td>${s.successRate}%</td>
          <td>${s.streak > 0 ? s.streak + ' 🔥' : '0'}</td>
          <td>${s.distance} km</td>
          <td>${s.bestDay}</td>
          <td>${achievementBadges || '—'}</td>
          <td>${s.trend}</td>
        </tr>
      `;
    });

    t.innerHTML = rows;

    // Update team stats
    const totalSteps = stats.reduce((a, b) => a + b.sum, 0);
    const totalDistance = stats.reduce((a, b) => a + parseFloat(b.distance), 0).toFixed(1);
    const totalCalories = stats.reduce((a, b) => a + parseInt(b.calories), 0);
    const avgSuccessRate = (stats.reduce((a, b) => a + parseFloat(b.successRate), 0) / stats.length).toFixed(0);

    this.updateTeamStats(stats, totalSteps, totalDistance, totalCalories, avgSuccessRate);
  },

  calculateAchievements(steps, dates, streak) {
    const achievements = [];

    // On Fire - 7+ day streak
    if (streak >= 7) {
      achievements.push({ icon: '🔥', desc: 'On Fire! 7+ day streak' });
    }

    // Beast Mode - any day with 15k+ steps
    if (steps.some(s => s >= 15000)) {
      achievements.push({ icon: '💪', desc: 'Beast Mode! 15K+ steps' });
    }

    // Perfect Week - 7 consecutive days hitting target
    if (streak >= 7) {
      achievements.push({ icon: '🎯', desc: 'Perfect Week!' });
    }

    // Consistency King/Queen - 90%+ success rate with 7+ days
    const successful = steps.filter(s => s >= this.targetSteps).length;
    const successRate = (successful / steps.length) * 100;
    if (successRate >= 90 && steps.length >= 7) {
      achievements.push({ icon: '🌟', desc: 'Consistency Champion!' });
    }

    return achievements;
  },

  updateTeamStats(stats, totalSteps, totalDistance, totalCalories, avgSuccessRate) {
    const teamStepsEl = document.getElementById('team-total-steps');
    const teamDistanceEl = document.getElementById('team-total-distance');
    const teamCaloriesEl = document.getElementById('team-total-calories');
    const teamSuccessEl = document.getElementById('team-success-rate');

    if (teamStepsEl) teamStepsEl.textContent = totalSteps.toLocaleString();
    if (teamDistanceEl) teamDistanceEl.textContent = `${totalDistance} km`;
    if (teamCaloriesEl) teamCaloriesEl.textContent = totalCalories.toLocaleString();
    if (teamSuccessEl) teamSuccessEl.textContent = `${avgSuccessRate}%`;
  }
};

  // ---- Boot
  document.addEventListener('DOMContentLoaded', () => {
    window.StepsTracker = StepsTracker;
    StepsTracker.init();
  });
  // ---- Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
    });
  }