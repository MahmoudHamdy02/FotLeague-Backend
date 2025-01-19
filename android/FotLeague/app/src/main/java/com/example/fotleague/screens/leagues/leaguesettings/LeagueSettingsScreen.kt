package com.example.fotleague.screens.leagues.leaguesettings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.exclude
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.NavigationBarDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScaffoldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.fotleague.R
import com.example.fotleague.ui.components.RowButton
import com.example.fotleague.ui.theme.Background
import com.example.fotleague.ui.theme.DarkGray

@Composable
fun LeagueSettingsScreen(
    viewModel: LeagueSettingsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        contentWindowInsets = ScaffoldDefaults.contentWindowInsets.exclude(NavigationBarDefaults.windowInsets),
        topBar = { TopBar() }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            LeagueSettingsContent(
                isLeagueOwner = state.isLeagueOwner
            )
        }

    }
}

@Composable
private fun LeagueSettingsContent(
    isLeagueOwner: Boolean
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Spacer(Modifier.height(4.dp))
        RowButton(
            icon = Icons.Default.Edit,
            text = "Rename league",
            onClick = {}
        )
        HorizontalDivider()
        RowButton(
            icon = Icons.Default.Replay,
            text = "Generate new code",
            onClick = {}
        )
        HorizontalDivider()
        if (isLeagueOwner) {
            RowButton(
                icon = Icons.Default.Delete,
                text = "Delete league",
                onClick = {}
            )
        } else {
            RowButton(
                icon = ImageVector.vectorResource(id = R.drawable.logout_24),
                text = "Leave league",
                onClick = {}
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TopBar() {
    TopAppBar(
        colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkGray),
        title = { Text(text = "League Settings", fontWeight = FontWeight.Medium) }
    )
}