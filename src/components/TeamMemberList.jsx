import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from './getToken';
import { useTranslation } from 'react-i18next';

const TeamMemberList = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://127.0.0.1:8000/api/team/members/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data);
      } catch (err) {
        setError(t("error_loading_team"));
        console.error(err);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div>
      <h3>{t("team_list_title")}</h3>
      {error && <p>{error}</p>}

      {!Array.isArray(members) ? (
        <p>{t("error_not_array")}</p>
      ) : members.length === 0 ? (
        <p>{t("no_team_members")}</p>
      ) : (
        <ul>
          {members.map(member => (
            <li key={member.id}>
              <strong>{member.name}</strong> — <em>{t(`role_${member.role}`)}</em>
            </li>
          ))}

        </ul>
      )}
    </div>
  );
};

export default TeamMemberList;
