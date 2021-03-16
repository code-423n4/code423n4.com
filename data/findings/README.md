# ⚠️ Editing findings data

You can edit this data manually or using netlify cms.

Note that the wardens and contest fields are used to create foreignkey relationships between objects.

```json
{
  "contest": "1", // id of contest
  "wardens": [""], // list form in case of teams
  "risk": "", // risk rating
  "summary": "", // warden summary
  "dupes": 0, // number of matching
  "award": 0 // amount awarded
}
```

You can find netlify cms at

`{domain.tld}/admin`
