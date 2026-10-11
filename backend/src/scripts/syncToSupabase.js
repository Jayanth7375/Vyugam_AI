const { db } = require('../database');
const { supabase } = require('../config/supabase');

async function syncAllToSupabase() {
  console.log('====================================================');
  console.log('🔄 VYUGAM AI HACKATHON: SQLITE -> SUPABASE DATA SYNC');
  console.log('====================================================\n');

  if (!supabase) {
    console.error('❌ Supabase client is not configured.');
    process.exit(1);
  }

  const tables = [
    { name: 'users', primaryKey: 'id' },
    { name: 'problem_statements', primaryKey: 'id' },
    { name: 'teams', primaryKey: 'id' },
    { name: 'team_members', primaryKey: 'id' },
    { name: 'submissions', primaryKey: 'id' },
    { name: 'evaluations', primaryKey: 'id' },
    { name: 'announcements', primaryKey: 'id' },
    { name: 'contact_messages', primaryKey: 'id' },
    { name: 'password_resets', primaryKey: 'id' }
  ];

  let totalSynced = 0;
  let hasSchemaErrors = false;

  for (const { name } of tables) {
    try {
      // 1. Fetch records from local SQLite
      const rows = db.prepare(`SELECT * FROM ${name}`).all();
      console.log(`📦 Table [${name}]: Found ${rows.length} local records`);

      if (rows.length === 0) {
        console.log(`   ⏩ Skipping empty table [${name}]\n`);
        continue;
      }

      // Convert SQLite integer booleans / dates if needed
      const cleanRows = rows.map(row => {
        const copy = { ...row };
        if ('is_active' in copy) copy.is_active = Number(copy.is_active);
        if ('is_banner' in copy) copy.is_banner = Number(copy.is_banner);
        if ('used' in copy) copy.used = Number(copy.used);
        return copy;
      });

      // 2. Upsert to Supabase in batches
      const { data, error } = await supabase.from(name).upsert(cleanRows);

      if (error) {
        console.error(`   ❌ Supabase Error on [${name}]:`, error.message);
        if (error.code === 'PGRST205') {
          hasSchemaErrors = true;
        }
      } else {
        console.log(`   ✅ Successfully synced ${cleanRows.length} rows to Supabase [${name}]!\n`);
        totalSynced += cleanRows.length;
      }
    } catch (err) {
      console.error(`   ❌ Exception syncing [${name}]:`, err.message);
    }
  }

  console.log('====================================================');
  if (hasSchemaErrors) {
    console.log('⚠️  NOTICE: Tables do not exist in Supabase yet!');
    console.log('👉 Please execute `backend/supabase_schema.sql` in the Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/juxfdgsyhpmyujxghqgb/sql/new');
    console.log('   Once the query runs, execute this sync script again!');
  } else {
    console.log(`🎉 ALL SYNC COMPLETED: ${totalSynced} records synced to Supabase!`);
  }
  console.log('====================================================');
}

if (require.main === module) {
  syncAllToSupabase().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { syncAllToSupabase };
