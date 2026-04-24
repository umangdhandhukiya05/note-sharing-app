select
  notes.*,
  profiles.display_name
from notes
join profiles
on notes.owner_id = profiles.id;